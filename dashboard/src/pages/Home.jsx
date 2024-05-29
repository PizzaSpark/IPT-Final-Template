import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    TextField,
} from "@mui/material";

export default function Mongo() {
    const initialData = {
        poster: "",
        name: "",
        director: "",
        year: "",
        logline: "",
    };
    const [currentData, setCurrentData] = useState(initialData);
    const [dataList, setDataList] = useState([]);
    const [refreshDataList, setRefreshDataList] = useState(false);

    const [modalState, setModalState] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await getFilmList();
    };

    const handleAddData = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(currentData).forEach((key) => {
            formData.append(key, currentData[key]);
        });

        try {
            const response = await axios.post(
                "http://localhost:1337/films",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const result = await response.data;

            if (result.success) {
                setRefreshDataList(!refreshDataList);
                setModalState(false);
                setImageUrl("");
            }
            alert(result.message);
        } catch (error) {
            console.error("Error adding menu:", error);
            alert("An error occured. Please try again.");
        }
    };

    async function getFilmList() {
        axios
            .get(`http://localhost:1337/films`)
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const handleUpdateData = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(currentData).forEach((key) => {
            formData.append(key, currentData[key]);
        });

        try {
            const response = await axios.put(
                `http://localhost:1337/films/${currentData._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
                setModalState(false);
                setImageUrl("");
            } else {
                alert("Failed to update menu. Please try again!.");
            }
        } catch (error) {
            console.error("Error updating menu:", error);
            alert("An error occured. Please try again.");
        }
    };

    const handleDeleteData = async (data) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this menu item?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:1337/films/${data._id}`
            );

            const result = response.data;
            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
            } else {
                alert("Failed to delete menu. Please try again!.");
            }
        } catch (error) {
            console.error("Error deleting menu:", error);
            alert("An error occured. Please try again.");
        }
    };

    const openModal = (dataTile, isEdit = false) => {
        setCurrentData(dataTile);
        setIsEditMode(isEdit);
        setModalState(true);
    };

    const closeModal = () => {
        setModalState(false);
        setImageUrl("");
    };

    const handleChange = (e) => {
        setCurrentData({
            ...currentData,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setCurrentData({
                ...currentData,
                image: e.target.files[0],
            });
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="page">
            <h1>Films</h1>

            <div className="menu-list">
                {dataList.map((menu, index) => (
                    <ProductCard key={index} menu={menu} />
                ))}
            </div>

            {/* //MARK: MODAL */}
            <Modal open={modalState} onClose={closeModal}>
                <Box className="modal">
                    {currentData && (
                        <form
                            className="modalform"
                            onSubmit={
                                isEditMode ? handleUpdateData : handleAddData
                            }
                        >
                            {imageUrl ? (
                                <div className="image-container">
                                    <img
                                        src={imageUrl}
                                        alt="Current"
                                        style={{
                                            width: "300px",
                                            height: "450px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ) : typeof currentData.image === "string" &&
                              currentData.image !== "" ? (
                                <div className="image-container">
                                    <img
                                        src={`http://localhost:1337/uploads/${currentData.image}`}
                                        alt="Current"
                                        style={{
                                            width: "300px",
                                            height: "450px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="image-container">
                                    <div
                                        style={{
                                            width: "300px",
                                            height: "450px",
                                            border: "1px solid #ccc",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        No image yet
                                    </div>
                                </div>
                            )}

                            <TextField
                                variant="outlined"
                                id="poster"
                                required
                                type="file"
                                label={
                                    isEditMode ? "Update Image" : "Add Image"
                                }
                                onChange={handleImageChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                variant="outlined"
                                id="title"
                                required
                                label="Title"
                                value={currentData.title}
                                onChange={handleChange}
                                disabled={isEditMode}
                            />

                            <TextField
                                variant="outlined"
                                id="director"
                                required
                                label="Director"
                                value={currentData.director}
                                onChange={handleChange}
                            />

                            <TextField
                                variant="outlined"
                                id="year"
                                required
                                type="number"
                                label="Year"
                                value={currentData.year}
                                onChange={handleChange}
                                inputProps={{ className: "hide-arrows" }}
                            />

                            <TextField
                                variant="outlined"
                                id="logline"
                                required
                                label="Logline"
                                value={currentData.logline}
                                onChange={handleChange}
                            />

                            <Button
                                className="tablebutton"
                                variant="contained"
                                type="submit"
                            >
                                {isEditMode ? "UPDATE" : "ADD"}
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

function FilmCard({ film }) {
    const imageUrl = `http://localhost:1337/uploads/${film.poster}`;

    return (
        <Card className="film-card">
            <CardMedia
                component="img"
                height="194"
                image={imageUrl}
                alt={film.poster}
            />
            <CardHeader
                title={<div style={{ whiteSpace: "nowrap" }}>{film.title}</div>}
            ></CardHeader>

            <CardContent>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                >
                    {film.director}
                </Typography>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                >
                    {film.year}
                </Typography>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                >
                    {film.logline}
                </Typography>
            </CardContent>
        </Card>
    );
}
