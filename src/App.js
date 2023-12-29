import {useState} from "react";

function App() {
    const [addFriendView, setAddFriendView] = useState(false);
    const [friends, setFriends] = useState(initialFriends);
    const [billFriend, setBillFriend] = useState(null)

    function handleAddFriendView() {
        setAddFriendView(!addFriendView);
    }

    function addFriendItem(friend) {
        /* NOT LIKE THIS AS THIS WILL MUTATE THE ARRAY AND MAY FAIL TO RERENDER THE COMPONENT, NOT IDEAL. ADD A NEW
         ARRAY. REACT IS ALL ABOUT IMUTABILITY OF PROPS AND STATE
         ALTOGETHER*/
        //setFriends([...friends, friend]);

        setFriends((friends) => [...friends, friend]);
        setAddFriendView(false)
    }

    function handleBill(value) {
        console.log(value);
        setFriends( friends => friends.map(
            (friend) => friend.id === billFriend.id ? {...friend, balance: friend.balance + value} : {...friend}
        ))

        setBillFriend(null);
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendsList friends={friends} onSelectFriend={setBillFriend} billFriend={billFriend}/>

                {addFriendView && <FormAddFriend onAddFriend={addFriendItem}/>}

                <Button clickHandler={handleAddFriendView}>Add friend</Button>
            </div>
            {billFriend && <FormSplitBill billFriend={billFriend} onSplitBill={handleBill}/>}
        </div>
    );
}


function FormAddFriend({onAddFriend}) {
    const [name, setName] = useState('');
    const [image, setImage] = useState('https://i.pravatar.cc/48');

    function handleSubmit(e) {
        e.preventDefault();

        /* GUARD CLAUSE TO PREVENT BLANK DATA*/
        if (!name || !image) return;

        const id = crypto.randomUUID();
        /*CREATE NEW FRIEND OBJECT*/
        const newFriend = {
            name,
            image: `${image}?=${id}`,
            balance: 0,
            id,
        };
        console.log(newFriend);
        onAddFriend(newFriend);

        /* RESET TO DEFAULT VALUES*/
        setName("");
        setImage('https://i.pravatar.cc/48');
    }

    return (
        <form action="" className="form-add-friend" onSubmit={(e) =>handleSubmit(e)}>
            <label htmlFor="">Friend name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

            <label htmlFor="">Image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>

            <Button className="button">Add</Button>
        </form>
    );
}

function FormSplitBill({billFriend, onSplitBill}) {
    const [bill, setBill] = useState(0);
    const [expense, setExpense] = useState(0)
    const friendExpense = bill ?  bill - expense : 0;
    const [billOwner, setBillOwner] = useState('user')
    let totalBill = []

    function handleBillSubmit(e) {
        e.preventDefault();

        if (!bill || !expense ) return;

        totalBill = {
            bill,
            expense,
            friendExpense,
            billOwner,
        }

        onSplitBill(totalBill.billOwner === "user" ? friendExpense : -friendExpense  );

    }

    return (
        <form action="" className="form-split-bill" onSubmit={(e) => handleBillSubmit(e)}>
            <h2>Split a bill with {billFriend.name} </h2>

            <label htmlFor="">Bill value</label>
            <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))}/>

            <label htmlFor="">Your expense</label>
            <input type="text" value={expense} onChange={(e) => setExpense(Number(e.target.value) > bill ? expense : Number(e.target.value))}/>

            <label htmlFor="">{billFriend.name}'s expense</label>
            <input type="text"  disabled={true} value={friendExpense}/>

            <label htmlFor="">Who is paying the bill</label>
            <select name="" id="" onChange={(e) => setBillOwner(e.target.value)}>
                <option value="user">You</option>
                <option value="friend">{billFriend.name}</option>
            </select>
            <Button className="button">Split bill</Button>
        </form>
    );
}

function FriendsList({friends, onSelectFriend, billFriend}) {
    //const friends = initialFriends
    return (
        <ul>
            {friends.map((friend) => (
                <Friend friend={friend} key={friend.id} onSelectFriend={onSelectFriend} billFriend={billFriend}/>
            ))}
        </ul>
    );
}

function Friend({friend, onSelectFriend, billFriend}) {
    const isSelected = billFriend?.id !== friend.id

    function handleSelectFriend() {
        if (isSelected)
            onSelectFriend(friend);
        else
            onSelectFriend(null);
    }

    return (
        <li className={isSelected ? ``: `selected`}>
            <img src={friend.image} alt={friend.name}/>
            <h3>{friend.name}</h3>

            { friend.balance < 0 &&
                <p className="red">
                    You owe {friend.name} ${Math.abs(friend.balance)}
                </p>
            }
            { friend.balance > 0 &&
                <p className="green">
                    {friend.name}  owes you ${Math.abs(friend.balance)}
                </p>
            }
            { friend.balance === 0 &&
                <p className="">
                    You and  {friend.name} are even
                </p>
            }
            <Button clickHandler={handleSelectFriend}>
                { isSelected ? `Select` : `Close`}
            </Button>
        </li>

    );
}

function Button({children, clickHandler}) {
    return (
        <button className="button" onClick={clickHandler}>
            {children}
        </button>
    );
}

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default App;


