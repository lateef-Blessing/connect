import prismadb from "../lib/prismadb.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const filteredUsers = await prismadb.user.findMany({
            where: {
                id: { not: loggedInUserId }
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true
            }
        });

        return res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsers Controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
