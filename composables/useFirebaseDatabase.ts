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
  limitToFirst,
  type DatabaseReference,
  startAt,
  equalTo,
} from "firebase/database";
import type Product from "~/interfaces/Product.interface";
import type Shelves from "~/interfaces/Shelves.interface";
import type Category from "~/interfaces/Category.interface";

interface PaginatedResult<T> {
  items: T[];
  nextPageKey: T[keyof T] | null;
  appendData?: any
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
        console.error("Error in create function:", error);
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
    const numberItemNeedGet = pageLimit + 1;

    let queryConstraints: any[] = [
      orderByChild(orderByField as string),
      limitToFirst(numberItemNeedGet),
    ];

    if (startAtValue) {
      queryConstraints.push(startAt(startAtValue));
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

        let nextPageKey = null;

        if (sortedData.length > 0 && sortedData.length === numberItemNeedGet) {
          nextPageKey = sortedData[numberItemNeedGet - 1][orderByField];
          sortedData.pop();
        }

        return {
          items: sortedData,
          nextPageKey: nextPageKey,
        };
      } else {
        return {
          items: [],
          nextPageKey: null,
        };
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  async function getObjectsByIds<T>(path: string, ids: string[]): Promise<T[]> {
    const dbRef = ref($firebaseDB, path);
    const promises = ids.map(id => get(child(dbRef, id)));
    const snapshots = await Promise.all(promises);
    const objects = snapshots.map(snapshot => snapshot.val() as T);
    return objects;
  }

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

  const findEmployeeByLoginCode = async (loginCode: string) => {
    const dbRef: DatabaseReference = ref(
      $firebaseDB,
      `stockCheck/employees/data`
    );
    const q = query(dbRef, orderByChild('loginCode'), equalTo(loginCode));
    let result = null;

    try {
      const snapshot = await get(q);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          result = childSnapshot.val();
        });
      } else {
        console.log('No matching user found.');
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
    } finally {
      return result;
    }
  }

  const getProductById = async (productId: string): Promise<Product | null> => {
    try {
      const dbRef: DatabaseReference = ref(
        $firebaseDB,
        `products/${productId}`
      );
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No product found with ID:", productId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };
  const getShelveById = async (shelveID: string): Promise<Shelves | null> => {
    try {
      const dbRef: DatabaseReference = ref($firebaseDB, `shelves/${shelveID}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No product found with ID:", shelveID);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };
  const getCategoryById = async (
    categoryId: string
  ): Promise<Category | null> => {
    try {
      console.log(`Fetching category with ID: ${categoryId}`);
      const dbRef: DatabaseReference = ref(
        $firebaseDB,
        `stockCheck/categories/data/${categoryId}`
      );
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        console.log("Category data:", snapshot.val());
        return snapshot.val();
      } else {
        console.log("No category found with ID:", categoryId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  };

  return {
    create,
    getAndListen,
    getItemsForPage,
    getOnce,
    getOnceWithObserver,
    updateData,
    getObjectsByIds,
    deleteData,
    getProductById,
    getShelveById,
    getCategoryById,
    findEmployeeByLoginCode,
  };
};
