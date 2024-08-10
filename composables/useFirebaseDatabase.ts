import {
  ref,
  set,
  onValue,
  get,
  child,
  update,
  remove,
  query,
  orderByChild,
  startAfter,
  limitToFirst,
  type DatabaseReference,
} from "firebase/database";

interface PaginatedResult<T> {
  items: T[];
  lastKey: T[keyof T] | null;
}

export const useFirebaseDatabase = () => {
  const { $firebaseDB }: any = useNuxtApp();

  const create = async (path: string, data: object): Promise<boolean> => {
    let result = false;
    const dataRef: DatabaseReference = ref($firebaseDB, path);
    await set(dataRef, data)
      .then(() => {
        result = true;
      })
      .catch((error) => {
        console.error(error);
        result = false;
      });

    return result;
  };

  const getItemsForPage = async <T>(
    path: any,
    orderByField: keyof T,
    pageLimit: number,
    startAtValue: string | number | null = null
  ): Promise<PaginatedResult<T>> => {
    const dbRef = ref($firebaseDB, path);

    let queryConstraints: any[] = [
      orderByChild(orderByField as string),
      limitToFirst(pageLimit),
    ];

    if (startAtValue) {
      queryConstraints.push(startAfter(startAtValue));
    }

    const queryDb = await query(dbRef, ...queryConstraints);

    // Execute the query
    try {
      const snapshot = await get(queryDb);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sortedData: T[] = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a, b) => (a[orderByField] > b[orderByField] ? 1 : -1));

        const newLastOrderByValue =
          sortedData.length > 0
            ? sortedData[sortedData.length - 1][orderByField]
            : null;
        return {
          items: sortedData,
          lastKey: newLastOrderByValue,
        };
      } else {
        return {
          items: [],
          lastKey: null,
        };
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const getAndListen = <T>(
    path: string,
    callbackFn: (data: T | null) => void
  ): void => {
    const dataRef: DatabaseReference = ref($firebaseDB, path);

    // Set up a listener for data changes
    onValue(
      dataRef,
      (snapshot) => {
        const data: T | null = snapshot.val();
        callbackFn(data);
      },
      (error) => {
        console.error(error);
        callbackFn(null);
      }
    );
  };

  const getOnce = (path: any) => {
    const dbRef = ref($firebaseDB);
    get(child(dbRef, path)).then((snapshot) => {
      return snapshot.val();
    });
  };

  const getOnceWithObserver = (key: any, callbackFn: any) => {
    const dataRef = ref($firebaseDB, key);
    return onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        callbackFn(data);
      },
      {
        onlyOnce: true,
      }
    );
  };

  const updateData = async (
    path: string,
    dataUpdate: Record<string, any>
  ): Promise<boolean> => {
    const dataRef: DatabaseReference = ref($firebaseDB, path);
    let result = false;
    await update(dataRef, dataUpdate)
      .then(() => {
        result = true;
      })
      .catch((error) => {
        result = false;
        console.error(error);
      });
    return result;
  };

  const deleteData = (key: any) => {
    const dataRef = ref($firebaseDB, key);
    return remove(dataRef);
  };

  return {
    create,
    getAndListen,
    getItemsForPage,
    getOnce,
    getOnceWithObserver,
    updateData,
  };
};
