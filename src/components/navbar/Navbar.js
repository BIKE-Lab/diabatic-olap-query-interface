import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

const Navbar = () => {
    return (
        <AppBar position='static' sx={{height:'40px',overflow:'hidden',backgroundColor:'#08094f'}}>
            <Container maxWidth='xl' className='flex justify-center items-center h-full w-full' sx={{backgroundColor:'#08094f'}}>
                <Toolbar disableGutters sx={{cursor:'pointer'}}>
                    <Typography 
                    variant='body1'
                    className='text-center italic  font-semibold'
                    sx={{
                        fontSize: '1.5rem',
                        color: '#28ecfa',
                        width: {xs: '100%', sm: '100%', md: '100%', lg: 'auto', xl: 'auto'},
                        p: '4px'
                    }}
                    noWrap>
                        <Link href='/'><>SETL<sub> OLAP</sub></> <span className='font-normal'>| BIKE </span></Link>
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar