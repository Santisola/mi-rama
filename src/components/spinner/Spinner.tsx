export default function Spinner({styles}: {styles?: React.CSSProperties}) {
  return (
    <div className="flex justify-center items-center">
      <div
	  	className="animate-spin rounded-full h-12 w-12"
		style={styles}
	  ></div>
    </div>
  )
}
