import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Abhinay",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Priyanka",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Sasanka",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];



const App = () => {
  const [showFriendForm, setShowFriendFrom] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null)
  const handleFriendFormClick = () => {
    setShowFriendFrom((show) => (!show));
  }

  const handleAddFriends = (friend) => {
    setFriends((friends)=>([...friends,friend]))
  }

  const handleSelectedFriend = (friend) => {
    setSelectedFriend((curr) => (curr === friend ? null : friend));
    setShowFriendFrom(false)
  }

  const handleSplitBill = (value) => {
    setFriends(f => f.map(friend => (friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend)));
    setSelectedFriend(null)
  }

  return (<div className="app">
    <div className="sidebar">
      <FriendsList friends={friends} onSelect={handleSelectedFriend} selectedFriend={selectedFriend} />
      {showFriendForm && <AddFriendForm onAddFriends={handleAddFriends} showForm = {setShowFriendFrom} />}
      <Button onClick={handleFriendFormClick}>
        {showFriendForm ? "Close" : "Add Friend"}
      </Button>
    </div>
    {selectedFriend && <AddBill selectedFriend={selectedFriend} handleSplitBill={handleSplitBill} />}
  </div>);
}

const FriendsList = ({friends, onSelect, selectedFriend}) => {
  return( <ul>
    {friends.map((friend) => (<Friend friend={friend} key={friend.id} onSelect={onSelect} selectedFriend={selectedFriend}/>))}
    
  </ul>)
}

const Friend = ({ friend, onSelect, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (<li className={isSelected? "selected":""}>
    <img src={friend.image} alt={friend.name}/>
    {friend.name}
    {friend.balance < 0 && (
      <p className="red">
        You owe {friend.name} ${friend.balance}
      </p>
    )}
    {friend.balance > 0 && (
      <p className="green">
        {friend.name} owes you ${Math.abs(friend.balance)}
      </p>
    )}
    {friend.balance === 0 && (
      <p>
        You and {friend.name} are set
      </p>
    )}
    <Button onClick={()=>onSelect(friend)}>
      {isSelected ? "Close" : "Select"}
    </Button>
  </li>    
)
}

const AddFriendForm = ({onAddFriends, showForm}) => {
  const [name, setName] = useState("");
  const [image, setImg] = useState("https://i.pravatar.cc/48")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !image) {
      return
    }
    const id= crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image :`${image}?=${id}`,
      balance: 0,
    }
    onAddFriends(newFriend)
    setName('')
    setImg("https://i.pravatar.cc/48")
    showForm(false)
    
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> Friend's Name</label>
      <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
      <label> Image Url</label>
      <input type="text" value={image} onChange={e=>setImg(e.target.value)} />
      <Button>Add</Button>
    </form>
  )
}

const Button = ({children, onClick}) => {
  return (
    <button className="button" onClick={onClick}>{children }</button>
  )
}

const AddBill = ({ selectedFriend , handleSplitBill }) => {
  const [bill, setBill] = useState("")
  const [myExpense, setMyExpense] = useState("")
  const paid = bill ? bill - myExpense : "";
  const [paidBy,setPaidBy] = useState("user")

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !myExpense) {
      return
    }
    handleSplitBill(paidBy === "user" ? paid : -myExpense);

  }

  return (
    <div>
     
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <h2>Split bill with {selectedFriend.name}</h2>
      <label> Total Bill </label>
        <input type="text" value={bill} onChange={e=>setBill(Number(e.target.value))} />
      <label> Your Amount </label>
      <input type="text" value={myExpense} onChange={e=>setMyExpense(Number(e.target.value) > bill ? myExpense : Number(e.target.value))} />
      <label> {selectedFriend.name} Share </label>
      <input type="text" value={paid} disabled />
      <label> Bill paid by </label>
      <select value={paidBy} onChange={e=>setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Add Split</Button>
      </form>
    </div>
  )
}




export default App