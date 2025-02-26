"use client";
import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from "@mui/material";
import { Menu, Calculate, InsertDriveFile, EditNote, Lock, Password, FontDownload, Map } from "@mui/icons-material";
import Link from "next/link";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarOpen ? 250 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 250 : 60,
            backgroundColor: "#fff", // White background
            color: "#333", // Dark text
            transition: "width 0.3s ease",
            borderRight: "1px solid #ddd",
          },
        }}
      >

        <List>
          {/* Toggle Button */}
          <ListItem
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2, // Adds spacing between items
    padding: "8px 16px", // Adds proper padding
  }}
>
  {/* Toggle Button */}
  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: "#333" }}>
    <Menu />
  </IconButton>

  {/* Sidebar Title */}
  <Typography
    variant="h6"
    sx={{
      fontWeight: "bold",
      flexGrow: 1, // Ensures proper spacing
      display: isSidebarOpen ? "block" : "none",
    }}
  >
    NabUtilities
  </Typography>
</ListItem>


          {/* Sidebar Links */}
          <ListItem button component={Link} href="/tax-calculator">
            <ListItemIcon>
              <Calculate sx={{ color: "#333" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Tax Calculator" />}
          </ListItem>

          <ListItem button component={Link} href="/file-utility">
            <ListItemIcon>
              <InsertDriveFile sx={{ color: "#333" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="File Utility" />}
          </ListItem>
          <ListItem button component={Link} href="/note-generator">
            <ListItemIcon>
              <EditNote sx={{ color: "#333" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Note Generator" />}
          </ListItem>
          <ListItem button component={Link} href="/password-generator">
            <ListItemIcon>
              <Password sx={{ color: "#333" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Password Generator" />}
          </ListItem>
          <ListItem button component={Link} href="/text-convertor">
            <ListItemIcon>
              <FontDownload sx={{ color: "#333" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Text Convertor" />}
          </ListItem>
          {/* <ListItem button component={Link} href="/map-component">
            <ListItemIcon>
              <Map sx={{ color: "#333" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Map Component" />}
          </ListItem> */}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
