"use client";
import { isValidCarModel, isValidPhoneNumber } from "@/helper/fieldVerification";
import useLocalStorage from "@/hook/useLocalStorage";
import { uploadFileToPinata } from "@/utils/pinata";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Home = () => {
  // State variables to hold form data
  const router= useRouter()
  const [storedValue] = useLocalStorage("token",null)
  useEffect(() => {
    if(!storedValue){
      return router.push("/sign-in")
     }else{
      axios.defaults.headers.common.Authorization= `Bearer ${storedValue}`
      return router.push("/")
     }
  }, [storedValue])
  
const initialState= {
  carModel:"",
  price:0,
  phone:'',
  noOfCopy:'',
  picture:[]

}
  const [carData, setCarData] = useState(initialState)

  const [error,setError]=useState({
    carModel:false,
    price:false,
    phone:false,
    noOfCopy:false,
    picture:false

  })

  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Function to handle form submission
  const handleSubmit = async (event) => {
    try {
    event.preventDefault();
  if(validateData()){
   const imagesPromises=  selectedFiles.map(item=>  uploadFileToPinata(item))
   carData.picture=  await Promise.all(imagesPromises)
   const {data} = await axios.post(`${process.env.BASE_URL}/api/v1/car/create`,carData);
   setCarData(initialState)
      console.log("data",data);
  }
    } catch (error) {
      
    }
  };

const handleInputField=(e)=>{
   const {name,value} = e.target
   setCarData({...carData, [name]:value})
   validateField({ name, value });
}

const validateField = ({ name, value }) => {
  if (name === "carModel") {
    setError({ ...error, [name]: !isValidCarModel(value) });
    return;
  }else if(name === "phone"){
    console.log("isValidPhoneNumber(value)", isValidPhoneNumber(value));
    setError({ ...error, [name]: !isValidPhoneNumber(value) });
    return;
  }
  
  setError({ ...error, [name]: !value });
};

  // Function to handle file selection
  const handleFileChange = async (event) => {
    const {files} = event.target;
    if (files) {
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const optionReturn = () => {
    const options = [];
    for (let index = 1; index <= 10; index++) {
      options.push(
        <option key={index} value={index}>
          {index}
        </option>
      );
    }
    return options;
  };

  const validateData = () => {
    const cloneError = { ...error };
    let check = true;
    if (!isValidCarModel(carData.carModel)) {
      cloneError.carModel = true;
      check = false;
    }
    if (!isValidPhoneNumber(carData.phone)) {
      cloneError.phone = true;
      check = false;
    }
    if(!carData.noOfCopy){
      cloneError.noOfCopy = true;
      check = false;
    }
    if(selectedFiles.length !== carData.noOfCopy){
      cloneError.picture = true;
      check = false;
    }
    setError(cloneError);
    return check;
  };

  return (
    <div className="xl:py-20 lg:py-10 px-4  py-7">
      <div className="lg:max-w-5xl bg-white mx-auto shadow-md p-5 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Form</h2>
        <form >
          {/* Code Field */}
          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700">
              Car Model:
            </label>
            <input
              type="text"
              name="carModel"
              className="border border-gray-300 rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring focus:border-blue-500"
              value={carData.carModel}
              onChange={handleInputField}
              required
            />
          </div>
           {error.carModel && <p className="text-red-500">Car model name must be at least 3 characters long.</p>}
      
          {/* Modal Field */}
          <div className="mb-4">
            <label htmlFor="modal" className="block text-gray-700">
              Price:
            </label>
            <input
              type="number"
              className="border border-gray-300 rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring focus:border-blue-500"
              name="price"
              value={carData.price}
              onChange={handleInputField}
              required
            />
          </div>

          {/* Price Field */}
          <div className="mb-4">
            <label  className="block text-gray-700">
              Phone:
            </label>
            <input
              type="tel"
              className="border border-gray-300 rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring focus:border-blue-500"
              name="phone"
             value={carData.phone}
              onChange={handleInputField}
              maxLength={11}
              required
            />
          </div>
          {error.phone && <p className="text-red-500">Enter the correct phone number.</p>}
          {/* Dropdown Field */}
          <div className="mb-4">
            <label htmlFor="dropdown" className="block text-gray-700">
              No of copies:
            </label>
            <select
              id="dropdown"
              className="border border-gray-300 rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring focus:border-blue-500"
              value={carData.noOfCopy}
              name="noOfCopy"
              onChange={handleInputField}
              required
            >
              <option  value="">Select copy</option>
            
             {optionReturn()}
             
            </select>
          </div>
          {error.noOfCopy && <p className="text-red-500">Select at least one.</p>}
          {/* Image Uploader */}
          <div className="mb-4">
            <label htmlFor="file" className="block text-gray-700">
              Upload Images:
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFiles && !!selectedFiles.length && selectedFiles.map((file, index) => (
                <Image
                height={20}
                width={20}
                 
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Image ${index}`}
                  className=" p-1  object-cover border border-gray-400 rounded"
                />
              ))}
              <div className="bg-gray-100 p-1 border border-gray-400 rounded w-20 h-20">
                <input
                  type="file"
                  id="file"
                  name="picture"
                  className="hidden"
                  accept="image/*"
                  multiple // Allow multiple file selection
                  onChange={handleFileChange}
                  required
                />
                <label
                  htmlFor="file"
                  className="h-full flex flex-col justify-center items-center w-full cursor-pointer text-xs whitespace-nowrap focus:outline-none "
                >
                  + Add Image
                </label>
              </div>
            </div>
          </div>
          {error.picture && <p className="text-red-500">upload more images you select no of copy {carData.noOfCopy}.</p>}
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 w-[250px] py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
