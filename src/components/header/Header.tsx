import Link from "next/link";
import UserButton from "./components/UserButton/UserButton";

export default function Header() {
  return (
	<header className='bg-primary text-white py-2'>
		<div className='container mx-auto px-2 flex items-center justify-between'>
			<div>
				<h1 className='font-bold text-2xl'>
					<Link href="/protagonistas">Mi Rama</Link>
				</h1>
				<p className='italic text-xs'>Realizá el seguimiento de la progresión personal y el desarrollo de protagonistas</p>
			</div>
			
			<UserButton />
		</div>
	</header>
  )
}
