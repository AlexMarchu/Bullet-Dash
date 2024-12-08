import axios from 'axios';

const URL = 'http://localhost:8000';

class AuthService {

    login(username: string, password: string) {
        return axios.post(`${URL}/?/`, {
            username: username,
            password: password
        })
        .then(response => {
            if (response.status != 200)
                return false;
            
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            return true
        });
    }

    updateUserScore(score: number) {
        return axios.post(`${URL}/?/`, {
            score: score
        })
        .then(response => {
            return response.status == 200;
        });
    }

    getUserScore() {
        return axios.get(`${URL}/?/`, {
            params: {
                username: localStorage.getItem('username')
            }
        })
        .then(response => {
            if (response.status != 200)
                return -1;
            return response.data['score'];
        });
    }

    getUsersScores(){
        return axios.get(`${URL}?/`);
    }

};

export default new AuthService();