    import axios from 'axios';

    const createAxiosInstance = (BaseUrl:any, type?:string) => {
    return axios.create({
        baseURL: BaseUrl,
        headers: {
        'Content-Type': type || 'application/json',
        },
        withCredentials:true
    });
    };

    export default createAxiosInstance;