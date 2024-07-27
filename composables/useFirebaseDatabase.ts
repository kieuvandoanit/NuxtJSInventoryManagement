import { ref, set, onValue, get, child, update, remove } from "firebase/database";

export const useFirebaseDatabase = () => {
  const { $firebaseDB }: any = useNuxtApp();

  const create = (key: any, data: object) => {
    const dataRef = ref($firebaseDB, key);
    set(dataRef, data)
      .then(() => {
        // Data saved successfully
        console.log("Create data successfully");
      })
      .catch((error) => {
        // The write failed
        console.error(error);
      })
  }

  const getAndListen = (key: any, callbackFn: any) => {
    const dataRef = ref($firebaseDB, 'users');
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      // callbackFn(data);
    }, (error) => {
      console.error(error)
    });
  }

  const getOnce = (key: any) => {
    const dbRef = ref($firebaseDB);
    get(child(dbRef, key)).then((snapshot) => {
      return snapshot.val();
    });
  }

  const getOnceWithObserver = (key: any, callbackFn: any) => {
    const dataRef = ref($firebaseDB, key);
    return onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      callbackFn(data);
    }, {
      onlyOnce: true
    });
  }

  const updateData = (key: any, dataUpdate: any) => {
    const dataRef = ref($firebaseDB, key);
    return update(dataRef, dataUpdate)
      .then(() => {
        // Updated data successfully
      })
      .catch((error) => {
        // Updated data failed
      })
  }

  const deleteData = (key: any) => {
    const dataRef = ref($firebaseDB, key);
    return remove(dataRef);
  }

  return {
    create,
    getAndListen,
    getOnce,
    getOnceWithObserver,
    updateData
  }
}


