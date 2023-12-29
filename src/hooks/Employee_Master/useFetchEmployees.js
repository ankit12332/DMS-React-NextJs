import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../../config/apiConfig';

const useFetchUsers = (gridApi) => {
  const [rowData, setRowData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (gridApi) gridApi.showLoadingOverlay();
      const response = await fetch(API_ENDPOINTS.GET_ALL_USERS);
      const data = await response.json();
      setRowData(data);
      if (gridApi) gridApi.hideOverlay();
    } catch (error) {
      console.error('Error fetching data:', error);
      if (gridApi) gridApi.showNoRowsOverlay();
    }
  }, [gridApi]);

  return { rowData, fetchData };
};

export default useFetchUsers;

//***************************************************************************************************** */
//********If You want updates in every 30 second then this is the code and comment the above code********
//***************************************************************************************************** */

// import { useState, useCallback, useEffect } from 'react';
// import { API_ENDPOINTS } from '../config/apiConfig';

// const useFetchUsers = (gridApi, interval = 30000) => { // Default polling interval set to 30 seconds
//     const [rowData, setRowData] = useState([]);

//     const fetchData = useCallback(async () => {
//         try {
//             if (gridApi) gridApi.showLoadingOverlay();
//             const response = await fetch(API_ENDPOINTS.GET_ALL_USERS);
//             const data = await response.json();
//             setRowData(data);
//             if (gridApi) gridApi.hideOverlay();
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             if (gridApi) gridApi.showNoRowsOverlay();
//         }
//     }, [gridApi]);

//     useEffect(() => {
//         const intervalId = setInterval(fetchData, interval);

//         return () => clearInterval(intervalId); // Cleanup interval on unmount
//     }, [fetchData, interval]);

//     return { rowData, fetchData };
// };

// export default useFetchUsers;
