import { Container, Title, Space, Divider } from "@mantine/core";

import Item from "../Item";

function Home() {
    return (
        <Container>
            <Space h="50px" />
            <Title align="center" color="red">
                Personal Shopping List
            </Title>
            <Space h="20px" />
            <Title order={2} align="center">
                {/* Enjoy big movies, hit series and more from RM17. */}
            </Title>
            <Space h="30px" />
            <Divider />
            <Space h="30px" />
            {/* list all the movies here */}
            <Item />
            <Space h="30px" />
        </Container>
    );
}

export default Home;
