import React from 'react'
import { toast } from "react-hot-toast";

const handleFirebaseError = (error) => {
    if (error.code === "auth/network-request-failed") {
        toast.error("Network request failed. Please check your internet connection.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
}

export default handleFirebaseError