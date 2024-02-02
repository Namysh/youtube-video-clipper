import { ref } from "vue";

const API_URL = "http://youtubeclipper-gzotm3xlza-ew.a.run.app";

export const useApi = () => {
  const isLoading = ref(false);
  const data = ref();

  const cutVideo = async (form) => {
    isLoading.value = true;
    try {
      await fetch("https://youtubeclipper-gzotm3xlza-ew.a.run.app/cut/", {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        body: JSON.stringify({
            ...form,
            start_time: form.start_time.split(':').reduce((acc, val, index, arr) => acc + parseInt(val) * Math.pow(60, arr.length - 1 - index), 0),
            end_time: form.end_time.split(':').reduce((acc, val, index, arr) => acc + parseInt(val) * Math.pow(60, arr.length - 1 - index), 0),
        }),
        method: "POST",
        mode: "cors",
        credentials: "omit",
      })
        .then((res) => res.json())
        .then((res) => (data.value = res));

      //   await fetch(`${API_URL}/cut`, {
      //     method: "POST",
      //     headers: {
      //       accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(form),
      //   })
      //     .then((res) => res.json())
      //     .then((res) => (data.value = res));
    } catch (e) {
    } finally {
      isLoading.value = false;
    }
  };

  const downloadClip = () => {
    fetch(
      `https://youtubeclipper-gzotm3xlza-ew.a.run.app/video/${data.value?.file}`,
      {
        headers: {
          accept: "application/json",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        mode: "cors",
        credentials: "omit",
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "clip.mp4");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        data.value = null;
      });
  };

  return {
    isLoading,
    data,
    cutVideo,
    downloadClip,
  };
};
