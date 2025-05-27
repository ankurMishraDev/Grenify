import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import { signup } from '../lib/api';
const useSignup =()=>{
    const queryClient = useQueryClient();
    const {mutate, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () =>{
        toast.success("Signup successful");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }});
    return {error, isPending, mutate}
    }
    export default useSignup;
