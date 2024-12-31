import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { getDDMMYYYYDate } from "./Date";

const UserData = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: new Date().toISOString().slice(0, 10),
    finalAdd: {
      countryId: 0,
      stateId: 0,
      cityId: 0,
    },
  });

  const countryOptions = [
    { countryId: 0, name: "Select Country" },
    { countryId: 1, name: "India" },
    { countryId: 2, name: "USA" },
    { countryId: 3, name: "Canada" },
  ];

  const stateOptions = [
    { countryId: 1, stateId: 1, name: "Goa" },
    { countryId: 1, stateId: 2, name: "Gujarat" },
    { countryId: 2, stateId: 3, name: "Assam" },
  ];

  const cityOptions = [
    { stateId: 1, cityId: 1, name: "Goa" },
    { stateId: 1, cityId: 2, name: "Gandinagar" },
    { stateId: 2, cityId: 3, name: "Jamnagar" },
    { stateId: 3, cityId: 4, name: "Bayad" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);
  

  const fetchUsers = async () => {
    const { data } = await axios.get(
      "https://676d384d0e299dd2ddfed5b5.mockapi.io/users"
    );
    setUserList(data);
    setFilteredUsers(data);
  };
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e, type) => {
    const { value } = e.target;
    setFormData((prev) => {
      if (type === "countryId") {
        return {
          ...prev,
          finalAdd: {
            countryId: parseInt(value),
            stateId: 0, // Reset state
            cityId: 0, // Reset city
          },
        };
      } else if (type === "stateId") {
        return {
          ...prev,
          finalAdd: {
            ...prev.finalAdd,
            stateId: parseInt(value),
            cityId: 0, // Reset city
          },
        };
      } else if (type === "cityId") {
        return {
          ...prev,
          finalAdd: {
            ...prev.finalAdd,
            cityId: parseInt(value),
          },
        };
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all fields");
      return;
    }

    await axios.post(
      "https://676d384d0e299dd2ddfed5b5.mockapi.io/users",
      formData
    );
    fetchUsers();
    resetForm();
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    await axios.delete(
      `https://676d384d0e299dd2ddfed5b5.mockapi.io/users/${currentUserId}`
    );
    fetchUsers();
    setCurrentUserId(null);
    setConfirmDeleteDialog(false);
  };

  const handleEdit = async () => {
    await axios.put(
      `https://676d384d0e299dd2ddfed5b5.mockapi.io/users/${currentUserId}`,
      formData
    );
    fetchUsers();
    resetForm();
    setEditDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: new Date().toISOString().slice(0, 10),
      finalAdd: {
        countryId: 0,
        stateId: 0,
        cityId: 0,
      },
    });
  };

  const handleAddDialogClose = () => {
    resetForm();
    setOpenDialog(false);
  };

  const handleEditDialogClose = () => {
    resetForm();
    setEditDialogOpen(false);
  };

  const handelFilter = (e, type) => {

    if(e.target.value == 0){
      setFilteredUsers(userList);
      return;
    }

    let filter ;
    switch(type){
      case "countryId":
        filter = userList.filter((user) => user.finalAdd.countryId == e.target.value);
      setFilteredUsers(filter);
      break;
      case "stateId":
        filter = userList.filter((user) => user.finalAdd.stateId == e.target.value);
      setFilteredUsers(filter);
      break;
      case "cityId":
        filter = userList.filter((user) => user.finalAdd.cityId == e.target.value);
      setFilteredUsers(filter);
      break;
      case "name":
         filter = userList.filter((user) => user.name.toLowerCase().includes(e.target.value.toLowerCase()));
          setFilteredUsers(filter);
      break;
      default:
        break;
    }

  };

  return (
    <div className="m-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">User Data</h1>
        <input
          type="text"
          placeholder="Search"
          className="border-2 pl-2 rounded-lg border-blue-gray-400"
          onChange={(e) => handelFilter(e, "name")}
        />

        <select
          onChange={(e) => handelFilter(e, "countryId")}
          className="bg-[#374151] h-10 p-2 text-white rounded-lg"
        >
          {countryOptions.map((country) => (
            <option key={country.countryId} value={country.countryId}>
              {country.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => handelFilter(e, "stateId")}
          className="bg-[#374151] h-10 p-2 text-white rounded-lg"
        >
          <option value={0}>Select State</option>
          {stateOptions
            .map((state) => (
              <option key={state.stateId} value={state.stateId}>
                {state.name}
              </option>
            ))}
        </select>

        {/* City Dropdown */}
        <select
          onChange={(e) => handelFilter(e, "cityId")}
          className="bg-[#374151] h-10 p-2 text-white rounded-lg"
        >
          <option value={0}>Select City</option>
          {cityOptions
            .map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.name}
              </option>
            ))}
        </select>

        <Button
          onClick={() => setOpenDialog(true)}
          className="p-3 rounded-lg font-bold"
        >
          Add User
        </Button>
      </div>

      <Dialog size="xs" open={openDialog} handler={handleAddDialogClose}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add User
            </Typography>
            <Input
              label="Name"
              size="lg"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              label="Email"
              size="lg"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              label="Phone"
              size="lg"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
            {/* Country Dropdown */}
            <select
              value={formData.finalAdd.countryId}
              onChange={(e) => handleAddressChange(e, "countryId")}
              className="bg-[#374151] w-full h-10 p-2 text-white rounded-lg"
            >
              {countryOptions.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* State Dropdown */}
            <select
              value={formData.finalAdd.stateId}
              onChange={(e) => handleAddressChange(e, "stateId")}
              className="bg-[#374151] w-full h-10 p-2 text-white rounded-lg"
            >
              <option value={0}>Select State</option>
              {stateOptions
                .filter(
                  (state) => state.countryId === formData.finalAdd.countryId
                )
                .map((state) => (
                  <option key={state.stateId} value={state.stateId}>
                    {state.name}
                  </option>
                ))}
            </select>

            {/* City Dropdown */}
            <select
              value={formData.finalAdd.cityId}
              onChange={(e) => handleAddressChange(e, "cityId")}
              className="bg-[#374151] w-full h-10 p-2 text-white rounded-lg"
            >
              <option value={0}>Select City</option>
              {cityOptions
                .filter((city) => city.stateId === formData.finalAdd.stateId)
                .map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.name}
                  </option>
                ))}
            </select>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Dialog>

      {/* Users Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#374151] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Date Of Birth</th>
              <th className="px-6 py-3">Country</th>
              <th className="px-6 py-3">State</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Edit</th>
              <th className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(({ id, name, email, phone, date, finalAdd }) => (
              <tr key={id} className="border-b bg-[#1e2735] text-white">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {name}
                </th>
                <td className="px-6 py-4">{email}</td>
                <td className="px-6 py-4">{phone}</td>
                <td className="px-6 py-4">{getDDMMYYYYDate(date)}</td>
                <td className="px-6 py-4">
                  {countryOptions.find(
                    (item) => item.countryId === finalAdd.countryId
                  )?.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {stateOptions.find(
                    (item) => item.stateId === finalAdd.stateId
                  )?.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {cityOptions.find((item) => item.cityId === finalAdd.cityId)
                    ?.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <Button
                    className="bg-blue-700 font-bold"
                    onClick={() => {
                      setEditDialogOpen(true);
                      setCurrentUserId(id);
                      setFormData({
                        ...formData,
                        ...{ name, email, phone, date, finalAdd },
                      });
                    }}
                  >
                    Edit
                  </Button>
                </td>
                <td className="px-6 py-4">
                  <Button
                    className="bg-red-500 font-bold"
                    onClick={() => {
                      setCurrentUserId(id);
                      setConfirmDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog
        size="xs"
        open={confirmDeleteDialog}
        handler={() => setConfirmDeleteDialog(false)}
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Are you sure?
            </Typography>
            <Button className="bg-red-800 font-bold" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              className="bg-gray-600 font-bold"
              onClick={() => setConfirmDeleteDialog(false)}
            >
              Cancel
            </Button>
          </CardBody>
        </Card>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog size="xs" open={editDialogOpen} handler={handleEditDialogClose}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Edit User
            </Typography>
            <Input
              label="Name"
              size="lg"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              label="Email"
              size="lg"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              label="Phone"
              size="lg"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
            {/* Country Dropdown */}
            <select
              value={formData.finalAdd.countryId}
              onChange={(e) => handleAddressChange(e, "countryId")}
              className="bg-[#374151] w-full h-10 p-2 text-white rounded-lg"
            >
              {countryOptions.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              value={formData.finalAdd.stateId}
              onChange={(e) => handleAddressChange(e, "stateId")}
              className="bg-[#374151] w-full h-10 p-2 text-white rounded-lg"
            >
              <option value={0}>Select State</option>
              {stateOptions
                .filter(
                  (state) => state.countryId === formData.finalAdd.countryId
                )
                .map((state) => (
                  <option key={state.stateId} value={state.stateId}>
                    {state.name}
                  </option>
                ))}
            </select>

            <select
              value={formData.finalAdd.cityId}
              onChange={(e) => handleAddressChange(e, "cityId")}
              className="bg-[#374151] w-full h-10 p-2 text-white rounded-lg"
            >
              <option value={0}>Select City</option>
              {cityOptions
                .filter((city) => city.stateId === formData.finalAdd.stateId)
                .map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.name}
                  </option>
                ))}
            </select>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleEdit} fullWidth>
              Save Changes
            </Button>
            <Button
              variant="text"
              color="gray"
              onClick={() => setEditDialogOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default UserData;