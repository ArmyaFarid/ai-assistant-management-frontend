type Props = {
    message? : string;
}
const RequiredTag : React.FC<Props> = ({message})=>{
    return (
        <b className="text-red-600 font-bold">{message} * </b>
    )
}

export default RequiredTag;
