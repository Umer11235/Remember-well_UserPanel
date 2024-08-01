import api from "./api";

 
export const handleLogin = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


 
export const addtribute = async (id,tribute) => {
  try {
    const response = await api.post("/Star/tributes?soulStarId="+id,tribute,{
      headers: {
        'Content-Type': 'application/json',
      }});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const gettribute = async (id) => {
  try {
    const response = await api.get("/star/tributes?soulStarId="+id,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleVerifyCode = async (userData) => {
  try {
    const response = await api.post("/auth/verify", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkPurchasedOrNot = async (userData) => {
  try {
    const response = await api.get("/star/check_purchased_star/"+userData,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkPurchasedOrNot2 = async (userData) => {
  try {
    const response = await api.get("/star/check_purchased_star2/"+userData,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkPublicProfile = async (userData) => {
  try {
    const response = await api.get("/star/check-public-profile/"+userData,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const get_profile = async () => {
  try {
    const response = await api.get("/star/get_profile/",{});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_starts = async () => {
  try {
    const response = await api.get("/star/get_starts/",{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const get_start = async (id) => {
  try {
    const response = await api.get("/star/get_start/"+id,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const get_start_public = async (id) => {
  try {
    const response = await api.get("/star/get_start_public/"+id,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const get_medias = async (id) => {
  try {
    const response = await api.get("/star/get_medias/"+id,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const handleManage = async (userData) => {
  try {
    const response = await api.post("/star/update-profile", userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
export const uploadBannerProfileForStar = async (dataPost) => {
  try {
    const response = await api.post("/star/update-star-profile-banner", dataPost, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const uploadBannerProfileForStarv2 = async (dataPost,setUploadProgress,setUploading,setUploadError) => {
  try {
    setUploading(true);
    const response = await api.post("/star/update-star-profile-banner", dataPost, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        setUploadProgress(progress);
      }
    });
    if(response&&response?.data&&response?.data?.isSuccess==true)
      {
        setUploading(false);
        return response.data;    

      }
      else

      {
        setUploading(false);
      }
    
    
  } catch (error) {
    setUploading(false);
    setUploadError(true);
    throw error;
  }
}; 
export const handleTribute = async (userData) => {
  try {
    const response = await api.post("/star/tribute", userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const uploadImage = async (userData,setUploadProgress,setUploading,setUploadError,setImagePreview,_file,_setFiles) => {
  try {
    const response = await api.post("/star/upload-image-star", userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
    });
       if(response&&response?.data&&response?.data?.isSuccess==true)
        {
          setImagePreview(response?.data?.data?.id);
          _setFiles(_file+1)
        }
    setUploading(false);
  } catch (error) {
    setUploading(false);
      setUploadError(true);
  }
}; 


export const delete_star_image = async (id) => {
  try {
    const response = await api.delete("/star/delete_star_image/"+id,{});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const makeQR = async (userData) => {
  try {
    const response = await api.post("/star/create-qr/"+userData, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};