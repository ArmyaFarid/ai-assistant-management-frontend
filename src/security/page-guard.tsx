"use client";
import {useProtected} from "@/lib/services/api/hooks/authHooks";
import {PropagateLoader} from "react-spinners";

const PageGuard = ({roles , failRedirectUrl  } : {roles? : string[] , failRedirectUrl: string }) => {
    const {authenticationLoading , isAuthenticated} = useProtected({redirectUrl :failRedirectUrl   , allowRoleOnly : roles })

    if(authenticationLoading){
        return (
            // <div className="w-screen fixed h-screen bg-red-500 z-40 flex items-center justify-center">
            //     <PropagateLoader />
            //     Loading
            // </div>
            <></>
        )
    }else{
        return <></>
    }
}
export default PageGuard;
