"use client"
import React, {useEffect, useRef, useState} from "react";
import {FaSearch} from "react-icons/fa";
import {IoSend} from "react-icons/io5";
import {cn} from "@/lib/utils";

type Props = {
    className? : string;
    placeHolder? : string;
    onTextChange? : (text: string)=>void
    onIconClick? : ()=>void
}
const FindJobSearchBar : React.FC<Props> = ({className , placeHolder, onTextChange , onIconClick})=>{
    const [value, setValue] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref for the textarea

    useEffect(() => {
        if (textareaRef.current) {
            let height = 120;
            // if(Number(textareaRef.current.scrollHeight) > 120){
            //     height = 120;
            // }else{
            //     height = textareaRef.current.scrollHeight;
            // }
            if ("style" in textareaRef.current) {
                textareaRef.current.style.height = "24px";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
        }
        if (onTextChange) {
            onTextChange(value);
        }
    }, [value, textareaRef]);



    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value); // Update the state with the textarea value
    };


    return (
        <div className={cn(`flex relative flex-row w-full items-center px-4 py-4 border-2 border-primary rounded-xl h-fit`,
                        className != '' && `${className}`,)}>
                <textarea placeholder={placeHolder ?? `Decrivez l’emploi que vous cherchez`}
                          className={cn("w-full !border-none focus:!outline-none  h-6 !border-primary focus:ring-0 resize-none leading-normal text-primary break-all",
                              value.length > 0 && "pr-10"
                          )}
                          ref={textareaRef}
                          style={{
                              height: "24px",
                              maxHeight: "200px",
                          }}
                          onChange={handleTextareaChange}
                >

                </textarea>
            {
                value.length == 0 &&
                <div className="h-full">
                    <FaSearch className="text-primary text-xl cursor-pointer"
                              onClick={()=>{
                                  if (onIconClick) {
                                      onIconClick()
                                  }}}
                    />
                </div>
            }


            {
                value.length > 0 &&
                <div className="absolute bottom-1 right-1 p-2 ">
                    <div className="p-2 bg-primary rounded-md cursor-pointer"
                         onClick={()=>{
                             if (onIconClick) {
                                 onIconClick()
                             }}}
                    >
                        <IoSend className="text-white text-xl"/>
                    </div>
                </div>
            }


        </div>
    )
}

export default FindJobSearchBar;
