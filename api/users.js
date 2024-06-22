export const getUsers = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        users: [
          {
            id: 1,
            name: "aastha",
            description: "welcome",
          },
        ],
      });
    }, 2000);
  });
};

export const getUsersDetails = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        users: [
          {
            id: id,
            name: `aastha ${id}`,
            description: "welcome",
            price: Math.floor(Math.random() * id * 100),
          },
        ],
      });
    }, 2000);
  });
};
