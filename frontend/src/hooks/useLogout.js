    import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";
const useLogout = () =>{
    const queryClient = useQueryClient()
    const {mutate}=useMutation({
        mutationFn: logout,
        onSuccess: () =>{
            toast.success("Logged out successfully");
            queryClient.invalidateQueries("authUser");
        }
    })
    return {mutate};
}
export default useLogout;
