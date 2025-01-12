
export const  CircleProgress = () => {
    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            <circle className="bg"
                    cx="125" cy="125" r="115" fill="none" stroke="#ddd" strokeWidth="20"
            ></circle>
            <circle className="fg"
                    cx="125" cy="125" r="115" fill="none" stroke="#5394fd" strokeWidth="20"
            ></circle>
        </svg>
    )
}
