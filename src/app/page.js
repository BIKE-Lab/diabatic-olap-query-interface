"use client"

import Viewport1 from "@/components/Viewports/Panel 1/Viewport1";
import { Provider } from "react-redux";
import store from '../lib/redux/store'
import Viewport2 from "@/components/Viewports/Panel 2/ViewPort2";
import Viewport3 from "@/components/Viewports/Panel 3/Viewport3";
import Box from '@mui/material/Box'
import ActionButtonGroup from "@/components/ActionButtonGroup/ActionButtonGroup";

export default function Home() {

  return (
    
    <Provider store={store}>
      <main>
        <Box className="flex items-stretch gap-1 pt-1 px-1">
          <Viewport1 />
          <Viewport2 />
          <Viewport3 />
        </Box>
        <ActionButtonGroup/>
        
      </main>
      
    </Provider>
  );
}
