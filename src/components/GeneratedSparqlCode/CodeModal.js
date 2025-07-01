import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Editor from '@monaco-editor/react';
import CircularProgress from '@mui/material/CircularProgress';

export default function CodeModal({loading, open, setOpen, query}) {  

    return (
        <Dialog
            open={open}
            onClose={()=>{setOpen(!open);}}
            fullWidth={true}
            maxWidth={false}
            fullScreen={true} className='m-2'>
            <DialogTitle className='font-semibold my-0 py-2 text-blue-900'>Query</DialogTitle>
                {
                    loading? 
                    <CircularProgress className='m-auto'/>  :
                    <Editor height="82%" width="100%" defaultLanguage="sparql" onChange={(e,v)=>{console.log(v)}} defaultValue="# Your SPARQL query will arrive soon..." value={query} options={{bracketPairColorization:true,readOnly:true, theme:'light'}}/>
                }              
            <DialogActions>
                <Button sx={{ border:'2px solid gray','&:hover': {color: 'gray'}}} className='bg-gray-600 border-2 text-white font-semibold' onClick={()=>{setOpen(!open);}}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}