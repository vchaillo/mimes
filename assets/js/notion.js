/////////////////////////////////////////////////////////////////////
//                GET EXPRESSIONS FROM NOTION DB                   //
/////////////////////////////////////////////////////////////////////

// response.results.forEach(function(item){
//     expressions.push(item.properties.Nom.title[0].plain_text)
//     console.log(item.properties.Nom.title[0].plain_text)
// });

// notionExpressions = [];
// const secretKey = "secret_6uURx5tlKpgue1jmTpC8JKJN9JW4d9OiAZnQhcKm67B"
// const databaseId = "48e67affd6bb45568f9358efd0abd727"
// // const databaseId = process.env.NOTION_DATABASE_ID

// fetch('https://api.notion.com/v1/databases/48e67affd6bb45568f9358efd0abd727/query', {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer secret_6uURx5tlKpgue1jmTpC8JKJN9JW4d9OiAZnQhcKm67B',
//         'Notion-Version': '2022-06-28',
//     },
//     // mode: 'no-cors',
//     // body: JSON.stringify({ "id": 78912 })
// })
// .then(response => response.json())
// .then(response => console.log(JSON.stringify(response)))
// .catch(error => {
//     console.error(error);
// })

// fetch('https://swapi.dev/api/people', {
//     method: 'GET',
//     // headers: {
//     //     'Accept': 'application/json',
//     //     'Content-Type': 'application/json',
//     //     'Authorization': 'Bearer secret_6uURx5tlKpgue1jmTpC8JKJN9JW4d9OiAZnQhcKm67B',
//     //     'Notion-Version': '2022-06-28',
//     // },
//     // mode: 'no-cors',
//     // body: JSON.stringify({ "id": 78912 })
// })
// .then(response => response.json())
// .then(response => console.log(JSON.stringify(response)))
// .catch(error => {
//     console.error(error);
// })
