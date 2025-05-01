import Image from "next/image";
import src from '../../app/assets/loader.png'
import classes from './styles.module.css'

export default function PumaLoader() {
  return (
    <div className={classes.loaderContainer}>
        <Image src={src} alt="Foto del puma" width={128} height={128} objectFit="contain" />
    </div>
  )
}
