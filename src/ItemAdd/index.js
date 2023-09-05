import { useState } from "react";
import axios from "axios";
import {
    Container,
    Title,
    Space,
    Card,
    TextInput,
    NumberInput,
    Divider,
    Button,
    Group,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const addItem = async (data) => {
    const response = await axios({
        method: "POST",
        url: "http://localhost:5000/items",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
    return response.data;
};

function ItemAdd() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [priority, setPriority] = useState("");

    const createMutation = useMutation({
        mutationFn: addItem,
        onSuccess: () => {
            notifications.show({
                title: "Shopping Added",
                color: "green",
            });
            navigate("/");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleAddNewMovie = async (event) => {
        event.preventDefault();
        createMutation.mutate(
            JSON.stringify({
                title: title,
                director: director,
                release_year: releaseYear,
                genre: genre,
                rating: rating,
            })
        );

        // const handleAddNewShoppingList = async (event) => {
        //     event.preventDefault();
        //     try {
        //         const response = await axios({
        //             method: "POST",
        //             url: "http://localhost:5000/items",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             data: JSON.stringify({
        //                 name: name,
        //                 quantity: quantity,
        //                 unit: unit,
        //                 priority: priority,
        //             }),
        //         });
        //         //show and success message
        //         notifications.show({
        //             title: "Shopping List Added",
        //             color: "green",
        //         });

        //         // redirect back to home page
        //         navigate("/");
        //     } catch (error) {
        //         notifications.show({
        //             title: error.response.data.message,
        //             color: "red",
        //         });
        //     }
    };

    return (
        <Container>
            <Space h="50px" />
            <Title order={2} align="center">
                Add New Shopping List
            </Title>
            <Space h="50px" />
            <Card withBorder shadow="md" p="20px">
                <TextInput
                    value={name}
                    placeholder="Enter the shop name here"
                    label="Name"
                    description="The name of the shop"
                    withAsterisk
                    onChange={(event) => setName(event.target.value)}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <NumberInput
                    value={quantity}
                    placeholder="Enter the shop quantity here"
                    label="Quantity"
                    description="The quantity of the shop"
                    withAsterisk
                    onChange={setQuantity}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <TextInput
                    value={unit}
                    placeholder="Enter the unit here"
                    label="Unit"
                    description="The unit of the shop"
                    withAsterisk
                    onChange={(event) => setUnit(event.target.value)}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <TextInput
                    value={priority}
                    placeholder="Enter the priority here"
                    label="Priority"
                    description="The priority of the shop"
                    withAsterisk
                    onChange={(event) => setPriority(event.target.value)}
                />
                <Space h="20px" />
                <Button fullWidth onClick={handleAddNewShoppingList}>
                    Add New Shopping List
                </Button>
            </Card>
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Go back to Home
                </Button>
            </Group>
            <Space h="100px" />
        </Container>
    );
}
export default ItemAdd;
