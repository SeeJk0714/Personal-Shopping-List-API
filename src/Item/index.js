import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Card, Badge, Group, Space, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchItems = async (priority = "", purchased = "") => {
    const response = await axios.get(
        "http://localhost:5000/items?" +
            (priority !== "" ? "priority=" + priority : "") +
            (purchased !== "" ? "&purchased=" + purchased : "")
    );
    return response.data;
};

const updataPurchasedItem = async (item_id = "") => {
    const response = await axios({
        method: "PUT",
        url: `http://localhost:5000/items/${item_id}`,
        purchased: true,
    });
    return response.data;
};

const deleteItem = async (item_id = "") => {
    const response = await axios({
        method: "DELETE",
        url: "http://localhost:5000/items/" + item_id,
    });
    return response.data;
};

function Item() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [priority, setPriority] = useState("");
    const [purchased, setPurchased] = useState("");

    const { data: items, error } = useQuery({
        queryKey: ["items", priority, purchased],
        queryFn: () => fetchItems(priority, purchased),
    });

    // useEffect(() => {
    //     axios
    //         .get("http://localhost:5000/items")
    //         .then((response) => {
    //             setItems(response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);

    const memoryItems = queryClient.getQueryData(["items", "", ""]);
    const priorityOptions = useMemo(() => {
        let options = [];
        if (memoryItems && memoryItems.length > 0) {
            memoryItems.forEach((item) => {
                if (!options.includes(item.priority)) {
                    options.push(item.priority);
                }
            });
        }
        return options;
    }, [memoryItems]);

    const deleteMutation = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["items", priority, purchased],
            });
            notifications.show({
                title: "Shopping List Deleted",
                color: "green",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updataPurchasedItem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["items", priority, purchased],
            });
            notifications.show({
                title: "purchased update",
                color: "green",
            });
        },
    });

    // const filterItem = async (priority = "") => {
    //     try {
    //         const response = await axios.get(
    //             "http://localhost:5000/items?priority=" + priority
    //         );
    //         setItems(response.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const filterPurchased = async (purchased = "") => {
    //     try {
    //         const response = await axios.get(
    //             "http://localhost:5000/items?purchased=" + purchased
    //         );
    //         setItems(response.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleItemDelete = async (item_id) => {
    //     try {
    //         // trigger API to delete from database
    //         await axios({
    //             method: "DELETE",
    //             url: "http://localhost:5000/items/" + item_id,
    //         });
    //         // show item is delete message
    //         notifications.show({
    //             title: "Shopping List Deleted",
    //             color: "green",
    //         });
    //         const newShoppingLists = items.filter((m) => m._id !== item_id);
    //         setItems(newShoppingLists);
    //     } catch (error) {
    //         notifications.show({
    //             title: error.response.data.message,
    //             color: "red",
    //         });
    //     }
    // };

    // const PurchasedUpdate = async (shop_id) => {
    //     try {
    //         await axios.put(`http://localhost:5000/items/${shop_id}`, {
    //             purchased: true,
    //         });

    //         notifications.show({
    //             title: "Shopping Purchased Update",
    //             color: "green",
    //         });

    //         const updatedShops = items.filter((s) => s._id !== shop_id);
    //         setItems(updatedShops);
    //     } catch (error) {
    //         notifications.show({
    //             title: error.response.data.message,
    //             color: "red",
    //         });
    //     }
    // };

    return (
        <>
            <Group position="apart">
                <Title order={3} align="center">
                    ShoppingLists
                </Title>
                <Button component={Link} to="/item_add" color="green">
                    Add New Shopping List
                </Button>
            </Group>
            <Space h="20px" />
            <Group>
                <select
                    onChange={(event) => {
                        setPriority(event.target.value);
                    }}
                >
                    <option value="">All Priority</option>
                    {priorityOptions.map((priority) => {
                        return (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        );
                    })}
                </select>
                <select
                    value={purchased}
                    onChange={(event) => {
                        setPurchased(event.target.value);
                    }}
                >
                    <option value="">All Rating</option>
                    <option value="no">Purchased</option>
                    <option value="yes">Unpurchased</option>
                </select>
            </Group>
            {/* <Group>
                <Button
                    onClick={() => {
                        filterItem("");
                    }}
                >
                    All
                </Button>
                <Button
                    onClick={() => {
                        filterItem("Low");
                    }}
                >
                    Low
                </Button>
                <Button
                    onClick={() => {
                        filterItem("Medium");
                    }}
                >
                    Medium
                </Button>
                <Button
                    onClick={() => {
                        filterItem("High");
                    }}
                >
                    High
                </Button>
                <Button
                    onClick={() => {
                        filterPurchased("no");
                    }}
                >
                    Unpurchased
                </Button>
                <Button
                    onClick={() => {
                        filterPurchased("yes");
                    }}
                >
                    Purchased
                </Button>
            </Group> */}
            <Space h="20px" />
            <Grid>
                {items
                    ? items.map((item) => {
                          return (
                              <Grid.Col key={item._id} span={4}>
                                  <Card withBorder shadow="sm" p="20px">
                                      <Title order={5}>{item.name}</Title>
                                      <Space h="20px" />
                                      <Group position="center" spacing="5px">
                                          <Badge color="green">
                                              {item.quantity}
                                          </Badge>
                                          <Badge color="yellow">
                                              {item.unit}
                                          </Badge>
                                          <Badge color="grape">
                                              {item.priority}
                                          </Badge>
                                      </Group>
                                      <Space h="20px" />
                                      <Group position="apart">
                                          <Button
                                              component={Link}
                                              to={"/items/" + item._id}
                                              color="blue"
                                              size="xs"
                                              radius="50px"
                                          >
                                              Edit
                                          </Button>
                                          <Button
                                              variant="gradient"
                                              gradient={{
                                                  from: "purple",
                                                  to: "pink",
                                              }}
                                              size="xs"
                                              radius="50px"
                                              onClick={() => {
                                                  updateMutation.mutate(
                                                      item._id
                                                  );
                                              }}
                                          >
                                              Purchased
                                          </Button>
                                          <Button
                                              color="red"
                                              size="xs"
                                              radius="50px"
                                              onClick={() => {
                                                  deleteMutation.mutate(
                                                      item._id
                                                  );
                                              }}
                                          >
                                              Delete
                                          </Button>
                                      </Group>
                                  </Card>
                              </Grid.Col>
                          );
                      })
                    : null}
            </Grid>
        </>
    );
}

export default Item;
