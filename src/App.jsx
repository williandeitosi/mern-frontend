import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/app.css";

function App() {
  const [itemText, setitemText] = useState("");
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState("")
  const [updateItemText, setUpdateItemText] = useState("");
  

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mern-api-nine.vercel.app/api/item", { item: itemText });
      setListItems((prev) => [...prev, res.data]);
      setitemText("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getItemList = async () => {
      try {
        const res = await axios.get("https://mern-api-nine.vercel.app/api/items");
        setListItems(res.data);
        console.log("render");
      } catch (err) {
        console.log(err);
      }
    };
    getItemList();
  }, []);

  const deleItems = async (id) => {
    try {
      const res = await axios.delete(`https://mern-api-nine.vercel.app/api/item/${id}`);
      const newListItem = listItems.filter((item) => item._id !== id);
      setListItems(newListItem);
    } catch (err) {
      console.log(err);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`https://mern-api-nine.vercel.app/api/item/${isUpdating}`,{item: updateItemText})
      console.log(res)
      const updateItemIndex = listItems.findIndex(item => item._id === isUpdating)
      const updateItem = listItems[updateItemIndex].item = updateItemText
      setUpdateItemText('')
      setIsUpdating('')
    } catch (err) {
      console.log(err)
    }
  }

  const renderUpdateForm =  () => {
    return (
    <form 
    className="update-form"
    onSubmit={(e)=>{updateItem(e)}}>  
      <input 
      className="update-new-input" 
      type="text" 
      placeholder="New Item" 
      onChange={e => {setUpdateItemText(e.target.value)}} 
      value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>

    )
  }

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form className="form" onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          name="addItems"
          id="addItems"
          placeholder="add items"
          onChange={(e) => {
            setitemText(e.target.value);
          }}
          value={itemText}
        />
        <button className="add-item" type="submit">
          Add
        </button>
      </form>
      <div className="todo-listItems">
        {listItems &&
          listItems.map((item) => (
            <div className="todo-item" key={item._id}>
              {
                isUpdating === item._id ? renderUpdateForm() : 
                <>
                
                      <p className="item-content">{item.item}</p>
                      
                        <button 
                        className="update-item" 
                        onClick={()=>{setIsUpdating(item._id)}}>
                          Update
                          </button>
                        <button
                          className="delete-item"
                          onClick={() => {
                            deleItems(item._id);
                          }}
                        >
                          Delete
                        </button>
                  </>
              }
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
