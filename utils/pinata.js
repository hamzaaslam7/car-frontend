export async function uploadFileToPinata(filePath) {
  if (!filePath) return;
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${process.env.PINATA_BEARER_TOKEN}`
  );
  const formData = new FormData();
  formData.append("file", filePath);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formData,
    redirect: "follow",
  };

  try {
    const res = await fetch(url, requestOptions);
    const result = await res.json();
    const { IpfsHash } = result;
    return `https://gray-amateur-leech-225.mypinata.cloud/ipfs/${IpfsHash}`;
  } catch (error) {
    throw new Error(error.message);
  }
}
