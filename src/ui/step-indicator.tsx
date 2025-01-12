import clsx from "clsx";
import React, {useEffect, useRef} from "react";
import './progressStyle.css'; // Import the CSS file


type CirclesStepProgressProps = {
    numbersOfStep: number;
    activeIndex: number;
}

export const StepIndicator: React.FC<CirclesStepProgressProps> = ({numbersOfStep, activeIndex}) => {

    const isActive = (index: number) => {
        return index <= activeIndex;
    }
    return (
        <div className="flex flex-row  items-center">
            {Array.from({length: numbersOfStep}).map((_, index) => {
                const value = index;
                return (
                    <CirclesStepProgressItem label={(index + 1).toString()} active={isActive(index + 1)} key={index}
                                             isInBeginning={index == 0}/>
                )
            })
            }
        </div>
    )
}

type ItemType = {
    label: string;
    active: boolean;
    isInBeginning?: boolean;
}
const CirclesStepProgressItem = ({label, active, isInBeginning}: ItemType) => {
    const getProgressClass = (isActive: boolean): string => {
        if (isActive) {
            return `w-4  rounded-full border-primary border-4 flex flex-col items-center justify-center font-extrabold  text-primary`;
        } else {
            return `w-4  rounded-full border-gray-300 border-4 flex flex-col items-center justify-center font-extrabold text-gray-300`;
        }
    }

    return (
        <>
            {
                isInBeginning ? (
                    <></>
                ) : (
                    <div
                        className={clsx(
                            'border-2 !grow  w-10 mx-2 ',
                            {
                                'border-primary': active,
                            },
                            {
                                'border-gray-300' : !active
                            }
                        )}
                    >
                    </div>
                )
            }

            <div className={
                clsx(
                    'w-10 h-10  rounded-full border-4 flex flex-col items-center justify-center font-extrabold',
                    {
                        'border-primary text-primary': active,
                    },
                    {
                        'border-gray-300 text-gray-300' : !active,
                    }
                )
            }>
                {label}
            </div>
        </>
    )
}




interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    progress?: number;
    active?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
                                                               size = 250,
                                                               strokeWidth = 20,
                                                               progress = 80,
                                                               active = true,
                                                           }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dash = (progress * circumference) / 100;

    const fillColor = active ? '#5394fd' : '#ddd';

    // useEffect(() => {
    //     const svgElement = svgRef.current;
    //     if (svgElement) {
    //         svgElement.style.setProperty('--progress', progress.toString());
    //         svgElement.style.setProperty('--circumference', circumference.toString());
    //         svgElement.style.setProperty('--dash', dash.toString());
    //     }
    // }, [progress, circumference, dash]);

    return (
        <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress">
            <circle className="bg"></circle>
            <circle className="fg"></circle>
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="40px"
                fontWeight="800"
                fill={fillColor}
                className="font-extrabold text-xl text-primary"
            >
                {2}
            </text>
        </svg>
    );
};

export default CircularProgress;

