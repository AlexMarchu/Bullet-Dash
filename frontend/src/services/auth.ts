import axios from "axios";

const URL = "http://localhost:8000/api";

class AuthService {
    
    async login(username: string, password: string) {
        try {
            const response = await axios.post(`${URL}/login/`, {
                username: username,
                password: password,
            });

            if (response.status !== 200) return false;

            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            return true;
        } catch (error) {
            console.error("Ошибка авторизации: ", error);
            return false;
        }
    }

    async updateUserScore(score: number) {
        try {
            const response = await axios.post(`${URL}/score/update_score/`, {
                score: score,
            });
            return response.status === 200;
        } catch (error) {
            console.error("Ошибка обновления счета: ", error);
            return false;
        }
    }

    async getUserScore() {
        try {
            const response = await axios.get(`${URL}/score/get_score/`, {
                params: {
                    username: localStorage.getItem("username"),
                },
            });

            if (response.status !== 200) return -1;
            return response.data["score"];
        } catch (error) {
            console.error("Ошибка получения счета: ", error);
            return -1;
        }
    }

    async getUsersScores() {
        try {
            const response = await axios.get(`${URL}/score/get_users_scores/`);
            return response.data;
        } catch (error) {
            console.error("Ошибка получения счетов пользователей: ", error);
            return null;
        }
    }

}

export default new AuthService();
