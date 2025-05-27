import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import { loginDetails } from '../lib/api';
const useLogin =()=>{
    const queryClient = useQueryClient();
    const {mutate, isPending, error} = useMutation({
    mutationFn: loginDetails,
    onSuccess: () =>{
        toast.success("Login successful");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }});
    return {error, isPending, mutate}
    }
    export default useLogin;
