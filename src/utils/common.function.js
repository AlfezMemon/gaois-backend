export const removeDuplicates = async (data, props) => {
    const seen = new Set();
    return data.filter(obj => {
        const propValues = props.map(prop => obj[prop]).join('-');
        if (seen.has(propValues)) {
            return false;
        }
        seen.add(propValues);
        return true;
    });
}

export const uniqueDataFromFirstArray = async (array1, array2, properties) => {
    // Create a Set to store unique combinations of property values from Array 2
    const uniqueSet = new Set();
    for (const obj of array2) {
        const key = properties.map((prop) => obj[prop]).join('|');
        uniqueSet.add(key);
    }

    // Use the filter method to return only the objects from Array 1 whose combination of property values is not present in Array 2
    const uniqueObjects = array1.filter((obj) => {
        const key = properties.map((prop) => obj[prop]).join('|');
        return !uniqueSet.has(key);
    });

    return uniqueObjects;
}

export const toConvertDate = (dateString) =>{
    // const dateString = "19/06/2023 00:00:00";
    // console.log(dateString);
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart?.split('/');
    const [hours, minutes, seconds] = timePart?.split(':');
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    // console.log('date'+ date.toISOString());
    return date;
}

// toConvertDate("01/08/2023 00:00:00")
export const formatDate = async (date) =>{
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    console.log(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
  
//   const originalDate = date;
//   const formattedDate = formatDate(originalDate);
  
//   console.log(formattedDate);


// const jsonData = [
//     { id: 1, name: 'John', age: 30 },
//     { id: 2, name: 'Jane', age: 25 },
//     { id: 1, name: 'John', age: 30 }, // Duplicate object
//     { id: 3, name: 'Alice', age: 35 },
//   ];

//   const uniqueData = removeDuplicates(jsonData, ['id', 'name', 'age']);
// console.log(uniqueData);

// Example usage:
// const array1 = [
//     { id: 1, name: 'Alice', age: 25 },
//     { id: 2, name: 'Bob', age: 30 },
//     { id: 3, name: 'Charlie', age: 28 },
//     { id: 4, name: 'David', age: 22 },
//   ];
  
//   const array2 = [
//     { id: 3, name: 'Charlie', age: 28 },
//     { id: 4, name: 'David', age: 22 },
//     { id: 6, name: 'Eva', age: 27 },
//   ];
  
//   const uniqueObjectsArray1 = uniqueDataFromFirstArray(array1, array2, ['id', 'name', 'age']);
//   console.log(uniqueObjectsArray1);