const FILE_NAME = "/words-en.json";

const getData = () => {
  console.log('get data');

  const data = fetch(FILE_NAME)
    .then(res => res.json())
    // .then(data => console.log(data))
    .catch(err => console.log('Ошибка чтения файла словаря', err));
  
  return data;
}


export default getData;
