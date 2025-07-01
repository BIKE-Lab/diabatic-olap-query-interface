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
import Typography from '@mui/material/Typography';
import { Editor } from '@monaco-editor/react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { extractChartData } from '@/lib/custom/helper';

export default function ResultModal({ resultGenTime, loading, open, setOpen, resultData }) {

    const [value, setValue] = useState('1');

    const [subTabValue, setSubTabValue] = useState('bar');

    const handleChange = (event, newValue) => {
        if (['1', '2', '3'].includes(newValue)) setValue(newValue);
        else setSubTabValue(newValue);
    };

    const rows = resultData.map((row, index) => {
        const flattenedRow = { id: index };
        Object.keys(row).forEach((key) => {
            const rawValue = row[key].value;
            // Convert to number if it's a valid number string
            flattenedRow[key] = !isNaN(rawValue) && rawValue !== '' ? Number(rawValue) : rawValue;
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
                ? <a href={params.value} style={{ color: 'blue' }} target="_blank" rel="noopener noreferrer">{params.value}</a>
                : params.value),
    })) : [];


    const chartData = extractChartData(resultData);

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
            ticks: {
                minRotation: 90,
                maxRotation: 90,
                color: '#000',
                font: {
                    weight: '500',
                    size: 12,
                },
            },
            },
            y: {
            ticks: {
                color: '#000',
                font: {
                    weight: '600',
                    size: 12,
                },
            },
            },
        },
        };


    return (
        <Dialog
            open={open}
            onClose={() => { setOpen(!open); }}
            fullWidth={true}
            maxWidth={false}
            fullScreen={true} className='m-2'>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {
                        !loading &&
                        <Typography className='font-semibold ml-2 text-xl text-blue-800 mb-0 pb-0 pt-2'>Result (Generated: {resultGenTime}ms)</Typography>
                    }
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Tabular" value="1" />
                        <Tab disabled={loading} label="Graphical" value="2" />
                        <Tab disabled={loading} label="JSON" value="3" />
                    </TabList>
                </Box>
                <TabPanel className='p-1 m-0' value="1">
                    <Box sx={{ height: "80vh" }}>
                        {
                            loading ?
                                <Box className='h-full w-full flex justify-center items-center flex-col gap-5'>
                                    <CircularProgress size={60} />
                                    <Typography className='font-semibold text-3xl text-blue-800'>Generating Results...</Typography>
                                </Box>
                                :
                                <DataGrid sx={{
                                    '& .MuiDataGrid-cell': { border: '1px solid #e3e3e3', },
                                    "& .MuiDataGrid-columnHeaders": { border: '1px solid #e3e3e3', borderTop: 'none' },
                                    "& .MuiDataGrid-sortIcon": { opacity: 'inherit !important', },
                                    '&.MuiDataGrid-root': { border: '1px solid #e3e3e3', },
                                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', }
                                }}
                                    rows={rows} columns={columns} pageSize={10}
                                    rowsPerPageOptions={[10]} />
                        }
                    </Box>
                </TabPanel>
                <TabPanel className="p-1 m-0" value="2">
                    <Box sx={{ height: "80vh" }} className="w-full overflow-auto">
                        <TabContext value={subTabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList centered onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Bar Graph" value="bar" />
                            <Tab label="Line Graph" value="line" />
                            </TabList>
                        </Box>

                        <TabPanel className="p-1 w-full m-0" value="bar">
                            <Box className="w-full flex justify-center items-center">
                            <Bar data={chartData} options={chartOptions} className="w-full h-auto" />
                            </Box>
                        </TabPanel>

                        <TabPanel className="p-1 w-full m-0" value="line">
                            <Box className="w-full flex justify-center items-center">
                            <Line data={chartData} options={chartOptions} className="w-full h-auto" />
                            </Box>
                        </TabPanel>

                        </TabContext>
                    </Box>
                </TabPanel>

                <TabPanel className='p-1 m-0' value="3">
                    <Box sx={{ height: 510 }}>
                        <Editor height="82%" width="100%"
                            onChange={(e, v) => { console.log(v) }}
                            defaultValue="# Your SPARQL query will arrive soon..."
                            value={JSON.stringify(resultData, null, 2)}
                            options={{ bracketPairColorization: true, readOnly: true, automaticLayout: true, }} />
                    </Box>
                </TabPanel>
            </TabContext>
            <DialogActions>
                <Button sx={{ border: '2px solid gray', '&:hover': { color: 'gray' } }} className='bg-gray-600 border-2 text-white font-semibold' onClick={() => { setOpen(!open); }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}