import Box from '@mui/material/Box'
import CopyrightIcon from '@mui/icons-material/Copyright';


export default function Footer() {
  return (
    <Box className="flex min-h-14 bg-cyan-900 text-white justify-center items-center space-x-2">
      <CopyrightIcon className="mr-2" />
      <span>BIKE Lab 2024-2025 | Developed by</span>
      <a
        href="https://github.com/Brainless-Loco"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-white hover:text-cyan-300"
      >
        Brainless Loco
      </a>
    </Box>

  )
}
