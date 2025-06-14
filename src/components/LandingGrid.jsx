export default function LandingGrid() {
    return (
        <div className="grid grid-cols-9 grid-rows-3 gap-4 p-4 h-full">

            <Box text="Box A" className="col-span-4" />
            <Box text="Box B" className="col-span-2" />
            <Box text="Box C" className="col-span-3" />
            <Box text="Box D" className="col-span-2" />
            <Box text="GritHub" className="col-span-5 justify-center" textSize="text-5xl" />
            <Box text="Box F" className="col-span-2" />
            <Box text="Box D" className="col-span-3" />
            <Box text="Box D" className="col-span-2" />
            <Box text="Box D" className="col-span-3" />
            <Box text="Box F" className="col-span-1" />
        </div>
    );
}

export function Box({ text, subText, className = '', textSize = 'text-xl' }) {
  return (
    <div className={`
        flex flex-col justify-center items-center 
         bg-bg-secondary p-4 rounded-lg shadow-md border-4 border-border 
         text-txt-secondary
         hover:bg-bg hover:text-txt transition-colors duration-300
         ${className}`}>
      <h2 className={`mb-2 font-bold ${textSize}`}>{text}</h2>
      <p className="text-red text-sm">{subText}</p>
    </div>
  );
}
