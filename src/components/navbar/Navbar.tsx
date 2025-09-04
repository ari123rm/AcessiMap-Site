// Importe os componentes do MUI
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import logo from '../../images/android-chrome-512x512 copy.png';

import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 

import BarChartIcon from '@mui/icons-material/BarChart';


import './Navbar.scss';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
   const { mode, toggleTheme } = useAppTheme();
 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

   const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };


  return (
    // AppBar é a barra de navegação principal
    <Box position="static" className="navbar">
      <Toolbar>
        {/* Ícone e Título do App (à esquerda) */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          
          <Typography 
            variant="h6" 
            component={Link} // Faz o Typography se comportar como um Link
            to="/" 
            className="navbar-title"
          >
            <img src={logo} alt="logo" />
            AcessiMap
          </Typography>
        </Box>
        <Button color="inherit" component={Link} to="/rankings">
          <BarChartIcon sx={{ mr: 1 }} />
        </Button>
        {/* Botões de Navegação (à direita) */}
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Box>
          
          {user ? (
            <>
            <IconButton onClick={handleMenu} color="inherit">
                <Avatar
                  alt={user.nome}
                  src={user.photo_url || ''} // Usa a foto do Google ou fica em branco
                >
                  
                  
                  {!user.photo_url && user.nome?.charAt(0).toUpperCase() }
                </Avatar>
            </IconButton>
               <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleLogout}>Sair</MenuItem>

              </Menu>
            
            </>
            // Se o usuário estiver logado
          ) : (
            // Se o usuário NÃO estiver logado
            <Box className="login-button" >
              <Button color="inherit" component={Link} to="/login">
               <AccountCircleIcon sx={{ mr: 1 }} />
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </Box>
  );
}

export default Navbar;