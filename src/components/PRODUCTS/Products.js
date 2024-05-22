import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProds, getProdsAsync, addProdAsync, removeProdAsync, updateProdAsync } from './productsSlice';
import { addItemToCart, updateItemInCart } from '../Cart/cartSlice';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit } from 'react-icons/fi';
import {
    Button,
    TextField,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
    CardActions,
} from '@mui/material';
import {jwtDecode} from 'jwt-decode';
import './styles.css';

const petTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ff4081',
        },
        secondary: {
            main: '#c6ff00',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#ff4081',
        },
    },
    typography: {
        fontFamily: 'Comic Sans MS, cursive, sans-serif',
        h5: {
            fontFamily: 'Papyrus, fantasy, serif',
        },
    },
});

const Prod = () => {
    const dispatch = useDispatch();
    const prods = useSelector(selectProds);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateId, setUpdateId] = useState("");
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [showUpdateProductForm, setShowUpdateProductForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [showDescriptionInCart, ] = useState(false);

    const token = localStorage.getItem('access');
    let isSuperuser = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            isSuperuser = decodedToken.isSuper || false;
        } catch (error) {
            console.error('Invalid token:', error);
        }
    }

    useEffect(() => {
        dispatch(getProdsAsync());
    }, [dispatch]);

    const handleAdditem = (prod) => {
        dispatch(addItemToCart(prod));
    };

    const handleRemoveProduct = (prodId) => {
        dispatch(removeProdAsync(prodId)).catch((error) => {
            console.error('Unauthorized:', error);
        });
    };

    const handleUpdateProduct = (prodId) => {
        setIsUpdating(true);
        setUpdateId(prodId);
        setShowUpdateProductForm(true);
        setShowNewProductForm(false);
    };

    const handleToggleNewProductForm = () => {
        setShowNewProductForm(!showNewProductForm);
        setShowUpdateProductForm(false);
    };

    const handleToggleUpdateProductForm = () => {
        setShowUpdateProductForm(!showUpdateProductForm);
        setShowNewProductForm(false);
    };

    const handleUpdate = async () => {
        const updatedProd = { name, description, price, imageFile };
        await dispatch(updateProdAsync({ prodId: updateId, updatedProd }));
        dispatch(updateItemInCart({ id: updateId, updatedProd }));
        setName("");
        setDescription("");
        setPrice(0);
        setIsUpdating(false);
        setUpdateId("");
        dispatch(getProdsAsync());
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    return (
        <ThemeProvider theme={petTheme}>
            <CssBaseline />
            <Container>
                <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
                    <Link to="/cats" style={linkStyle}>🐱 Cats</Link>
                    <Link to="/dogs" style={linkStyle}>🐶 Dogs</Link>
                </Typography>
                <hr />

                <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '20px' }}>
                    {isSuperuser && (
                        <>
                            <Button variant="outlined" onClick={handleToggleNewProductForm}>
                                {showNewProductForm ? "Hide New Product Form" : <><FiPlus /> Show New Product Form</>}
                            </Button>
                            <Button variant="outlined" onClick={handleToggleUpdateProductForm}>
                                {showUpdateProductForm ? "Hide Update Product Form" : <><FiEdit /> Show Update Product Form</>}
                            </Button>
                        </>
                    )}
                    <Button component={Link} to="/Cart" variant="contained" color="primary">Go to Cart</Button>
                </Grid>

                <hr />

                <Grid container spacing={3}>
                    {prods.map((prod, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id || index}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={prod.image}
                                    alt={prod.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{prod.name}</Typography>
                                    <Typography variant="body1" gutterBottom>{showDescriptionInCart ? prod.description : ""}</Typography>
                                    <Typography variant="body1" gutterBottom>${prod.price}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleAdditem(prod)} variant="contained" color="primary">Add to Cart</Button>
                                    {isSuperuser && (
                                        <>
                                            <Button onClick={() => handleRemoveProduct(prod.id)} variant="contained" color="error">Remove</Button>
                                            <Button onClick={() => handleUpdateProduct(prod.id)} variant="contained" color="warning">Update</Button>
                                        </>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {showNewProductForm && (
                    <Box sx={{ marginTop: '20px' }}>
                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ marginBottom: '12px' }} />
                        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth sx={{ marginBottom: '12px' }} />
                        <TextField type="number" label="Price" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth sx={{ marginBottom: '12px' }} />
                        <input type="file" onChange={handleImageChange} style={{ marginBottom: '12px' }} />
                        <Button variant="contained" color="primary" onClick={() => dispatch(addProdAsync({ name, description, price, imageFile }))}>Add Product</Button>
                    </Box>
                )}

                {showUpdateProductForm && isUpdating && (
                    <Box sx={{ marginTop: '20px' }}>
                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                        <TextField type="number" label="Price" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
                        <input type="file" onChange={handleImageChange} />
                        <Button variant="contained" color="primary" onClick={handleUpdate}>Update Product</Button>
                    </Box>
                )}
            </Container>
        </ThemeProvider>
    );
};

const linkStyle = {
    marginRight: '20px',
    textDecoration: 'none',
    color: '#ff4081',
    transition: 'color 0.3s ease, transform 0.3s ease',
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid transparent'
};

const hoverEffect = {
    color: '#000',
    borderColor: '#ccc',
    transform: 'scale(1.05)'
};

Object.assign(linkStyle, {
    ':hover': hoverEffect
});

export default Prod;
