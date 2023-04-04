import axios from "axios";
import swal from "sweetalert";

export const register = (dataForm, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_PENDING" });
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/v1/user/register`,
      dataForm
    );
    swal({
      title: "Register Success",
      icon: "success",
    });
    dispatch({ type: "REGISTER_SUCCESS" });
    navigate("/login");
  } catch (error) {
    console.log(error);
    swal({
      title: "Failed",
      icon: "warning",
    });
    dispatch({ type: "REGISTER_ERROR" });
  }
};
