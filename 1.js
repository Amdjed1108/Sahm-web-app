// async function fetchData() {
//     try { const response = await fetch('https://api.example.com/data');
        
//     }

//     } catch (error) {

//     }
// }


const items = [
{ name: 'Bike',price: 100},
{ name: 'TV',price: 200},
{ name: 'Album',price: 10},
{ name: 'Book',price: 5},
{ name: 'Phone',price: 500},
{ name: 'Computer', price: 1000 },
{ name: 'Keyboard', price: 25},
];

    const filteredItems = items.filter((item) => item.price > 100);
console.log(filteredItems.map(i => i.name).

// const mappedItems = items.map((item) => item.name);
// console.log(mappedItems);

// const reducedItems = items.reduce((acc, item) => acc + item.price, 0);
// console.log(reducedItems);

// const sortedItems = items.sort((a, b) => a.price - b.price);
// console.log(sortedItems);




