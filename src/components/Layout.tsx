import React, { ReactNode } from 'react';
import { Box, Flex, Container } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../connection.js";


interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps>  = ({ children }) => {
    return (
        <Container
        // as="div"
        className="w-full">
            <Flex
                // as="header"
                className="flex justify-between border-b-2 border-blue-300 p-4"
            >
                <Box className="text-2xl font-bold text-blue-600">
                    Proposal Dapp
                </Box>
                <w3m-button />
            </Flex>
            <Box 
            // as="main"
            >{children}</Box>
            <ToastContainer />
        </Container>
    );
};

export default Layout;