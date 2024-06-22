const axios = require('axios');

// Function to get the token
async function getToken() {
    try {
        const authResponse = await axios.post('https://staging.fpv.hvd-bb.de/api/api_auth.php', {
            username: 'fpv_json_username',
            password: 'fpv_json_password'
        });

        if (authResponse.data && authResponse.data.token) {
            return authResponse.data.token;
        } else {
            console.error('Error obtaining token:', authResponse.data);
            return null;
        }
    } catch (error) {
        console.error('Error during authentication:', error.message);
        return null;
    }
}

// Function to fetch data
async function fetchData(token) {
    try {
        const dataResponse = await axios.get('https://staging.fpv.hvd-bb.de/api/api_data.php', {
            params: {
                pv_json_user: 'fpv_json_username',
                pv_json_token: token,
                nname: 'Becker'
            }
        });

        if (dataResponse.data) {
            return dataResponse.data;
        } else {
            console.error('Error fetching data:', dataResponse.data);
            return null;
        }
    } catch (error) {
        console.error('Error during data fetch:', error.message);
        return null;
    }
}

// Main function
async function main() {
    const token = await getToken();
    if (token) {
        const data = await fetchData(token);
        if (data) {
            console.log('Data:', data);
        } else {
            console.log('Failed to fetch data');
        }
    } else {
        console.log('Failed to get token');
    }
}

// Run the main function
main();
