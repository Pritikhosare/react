import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';

function Users() {

    const [values, setValues] = useState([]);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setemail] = useState("");
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState("");
    const [sortValue, setSortValue] = useState("")
    const [items, setItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);

    const sortOptions = ["firstName", "lastName", "email"];

    useEffect(() => {
        axios.get("http://localhost:8000/users").then(response => {
            setValues(response.data);
            setfirstName(response.data[0].firstName)
            setlastName(response.data[0].lastName)
            setemail(response.data[0].email)
            setUserId(response.data[0].id)
        })
    }, []);

    function deleteRecord(id) {
        axios.delete('http://localhost:8000/users/' + id)
            .then(response => {
                // console.log(response);
                // console.log(response.data);
            })
    }

    function selectUser(id) {
        console.log(values)
        let item = values[id - 1]
        setfirstName(item.firstName)
        setlastName(item.lastName)
        setemail(item.email)

    }


    function updateUser() {
        const item = { firstName, lastName, email }
        axios.put('http://localhost:8000/users/' + userId, item)
            .then(response => {
                console.log(response.data);
            })
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        return await axios.get(`http://localhost:8000/users?q=${data}`)
            .then((response) => {
                setValues(response.data);
                setData("");
            })
            .catch((err) => console.log(err))
    };

    const handleReset = async (e) => {
        let value = e.target.value;
        return await axios
            .get(`http://localhost:8000/users?_sort=${data}&_order=asc`)
            .then((response) => {
                setValues(response.data);
            })
            .catch((err) => console.log(err));
    };

    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(data);
        return await axios
            .get(`http://localhost:8000/users?_sort=${value}&_order=asc`)
            .then((response) => {
                setValues(response.data);
            })
            .catch((err) => console.log(err));
    };

    const handleFilter = async (value) => {
        return await axios
            .get(`http://localhost:8000/users?_status=${value}`)
            .then((response) => {
                setValues(response.data);
            })
            .catch((err) => console.log(err));
    };

    let limit = 10;
    useEffect(() => {
        const getUsers = async () => {
            const response = await axios.get(`http://localhost:8000/users?_page=1&_limit=${limit}`)
       
        const data = await response.data;
        setPageCount(Math.ceil(29/10));
        console.log(Math.ceil(29/10));
        setItems(data);
        
        getUsers();
        };
    },[]);
    console.log(items);

    const fetchUsers= async (currentPage) => {
        const response= await axios.get(`http://localhost:8000/users?_page=${currentPage}&_limit=3`)
    
    const data  = await response.data();
    return data;
    };
    const handlePageClick = async (data)=>{
        console.log(data.selected);
        let currentPage = data.selected + 1;
        const usersFormServer = await fetchUsers(currentPage);
        setItems(usersFormServer);
    };

    return (

        <div className='user'>
            <h1>Update User</h1>
            <div className='form'>
                <form className='update-form'>
                    <input className='upt' type="text" placeholder='First Name' value={firstName} onChange={(e) => setfirstName(e.target.value)} />
                    <br></br><br></br><br></br>
                    <input className='upt' type="text" placeholder='Last Name' value={lastName} onChange={(e) => setlastName(e.target.value)} />
                    <br></br><br></br><br></br>
                    <input className='upt' type="text" placeholder='Email Id' value={email} onChange={(e) => setemail(e.target.value)} />
                    <br></br><br></br> <br></br><br></br><br></br>
                    <button className='btn3' onClick={updateUser}>Update User</button>
                </form>
            </div>
            <br></br>
            <br></br>

            <form style={{ margin: "auto", padding: "50px", maxWidth: "400px", alignContent: "center" }}
                onSubmit={handleSearch}>
                <input type="text" placeholder='Search Name...'
                    value={data}
                    onChange={(e) => setData(e.target.value)} />
                <button type='submit' color='dark'>Search</button>
                <button color='info' onClick={() => handleReset()}>Reset</button>


                <h5>Sort By:</h5>
                <select
                    style={{ width: "50%", borderRadius: "2px", height: "30px" }}
                    onChange={handleSort}
                    value={sortValue}
                >
                    <option>Please Select Value</option>
                    {sortOptions.map((item, id) => (
                        <option value={item} key={id}>{item}</option>
                    ))}
                </select>

                <h5>Filter By Status:</h5>
                <button color='success' onClick={() => handleFilter("Active")}>Active</button>
                <button color='danger' style={{ marginLefr: "20px" }} onClick={() => handleFilter("Inactive")}>Inactive</button>
            </form>
            {
                <table>
                    <tr>
                        <th>First Name</th>
                        <th>Last  Name</th>
                        <th>Email</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                    {values.map(item => (
                        <tr key={item.id}>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.email}</td>
                            <td><button className='btn1' onClick={() => selectUser(item.id)}>Update</button></td>
                            <td><button className='btn2' onClick={() => deleteRecord(item.id)}>Delete</button></td>
                        </tr>
                    ))}
                </table>

            }
            <div>
                <ReactPaginate 
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                />
            </div>
        </div>
    );
}

export default Users;
