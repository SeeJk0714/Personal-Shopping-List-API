import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Space,
    Card,
    TextInput,
    NumberInput,
    Divider,
    Button,
    Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";

const getItem = async (id) => {
    const response = await axios.get("http://localhost:5000/items/" + id);
    return response.data;
};

const updateItem = async ({ id, data }) => {
    const response = await axios({
        method: "PUT",
        url: "http://localhost:5000/items/" + id,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
    return response.data;
};

function ItemEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [priority, setPriority] = useState("");
    const { data } = useQuery({
        queryKey: ["item", id],
        queryFn: () => getItem(id),
        onSuccess: (data) => {
            setName(data.name);
            setQuantity(data.quantity);
            setUnit(data.unit);
            setPriority(data.priority);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateItem,
        onSuccess: () => {
            // show add success message
            notifications.show({
                title: "Shopping List Edited",
                color: "green",
            });
            // redirect back to home page
            navigate("/");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleUpdateItem = async (event) => {
        event.preventDefault();
        updateMutation.mutate({
            id: id,
            data: JSON.stringify({
                name: name,
                quantity: quantity,
                unit: unit,
                priority: priority,
            }),
        });
    };

    return (
        <Container>
            <Space h="50px" />
            <name order={2} align="center">
                Add New Shopping List
            </name>
            <Space h="50px" />
            <Card withBorder shadow="md" p="20px">
                <TextInput
                    value={name}
                    placeholder="Enter the shop name here"
                    label="name"
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
                    label="quantity"
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
                    label="priority"
                    description="The priority of the shop"
                    withAsterisk
                    onChange={(event) => setPriority(event.target.value)}
                />
                <Space h="20px" />
                <Button fullWidth onClick={handleUpdateItem}>
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
export default ItemEdit;
