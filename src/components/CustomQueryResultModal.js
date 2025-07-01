import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel'

import { useState } from 'react';
import Typography  from '@mui/material/Typography';
import { Editor } from '@monaco-editor/react';

export default function CustomQueryResultModal({resultGenTime, loading, open, setOpen, resultData}) {
    
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const rows = resultData.map((row, index) => {
        const flattenedRow = { id: index };
        Object.keys(row).forEach((key) => {
          flattenedRow[key] = row[key].value;
        });
        return flattenedRow;
      });


    const isValidUrl = (string) => {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
    };
    
    // Generate columns
    const columns = resultData.length > 0 ? Object.keys(resultData[0]).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
    resizable: true,
    renderCell: (params) => (
        isValidUrl(params.value)
                ? <a href={params.value} style={{color:'blue'}} target="_blank" rel="noopener noreferrer">{params.value}</a>
                : params.value),
    })) : [];



    return (
        <Dialog
            open={open}
            onClose={()=>{setOpen(!open);}}
            fullWidth={true}
            maxWidth={false}
            fullScreen={true} className='m-2'>
                <TabContext  value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        {
                            !loading && 
                            <Typography className='font-semibold ml-2 text-xl text-blue-800 mb-0 pb-0 pt-2'>Result (Generated: {resultGenTime}ms)</Typography>
                        }
                        <TabList  onChange={handleChange} aria-label="lab API tabs example">
                            <Tab  label="Tabular" value="1" />
                            <Tab disabled={loading} label="JSON" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel className='p-1 m-0' value="1">
                        <Box sx={{height:510}}>
                            {
                                loading?
                                <Box className='h-full w-full flex justify-center items-center flex-col gap-5'>
                                    <CircularProgress size={60}/>
                                    <Typography className='font-semibold text-3xl text-blue-800'>Generating Results...</Typography>
                                </Box>
                                 :
                                <DataGrid sx={{
                                    '& .MuiDataGrid-cell': {border: '1px solid #e3e3e3',},
                                    "& .MuiDataGrid-columnHeaders":{border:'1px solid #e3e3e3',borderTop:'none'},
                                    "& .MuiDataGrid-sortIcon": {opacity: 'inherit !important',},
                                    '&.MuiDataGrid-root': {border: '1px solid #e3e3e3',}, 
                                    '& .MuiDataGrid-columnHeaderTitle': {fontWeight: 'bold',}}}
                                    rows={rows} columns={columns} pageSize={10}
                                    rowsPerPageOptions={[10]} />
                            }
                        </Box>     
                    </TabPanel>
                    <TabPanel className='p-1 m-0' value="2">
                        <Box sx={{height:510}}>
                            <Editor height="82%" width="100%"
                            onChange={(e,v)=>{console.log(v)}} 
                            defaultValue="# Your SPARQL query will arrive soon..." 
                            value={JSON.stringify(resultData, null, 2)} 
                            options={{bracketPairColorization:true,readOnly:true, automaticLayout: true,}}/>
                        </Box>
                    </TabPanel>
                </TabContext>              
            <DialogActions>
                <Button sx={{ border:'2px solid gray','&:hover': {color: 'gray'}}} className='bg-gray-600 border-2 text-white font-semibold' onClick={()=>{setOpen(!open);}}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}