import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, TextField, MenuItem, Button } from "@mui/material";

function App() {
  const [formData, setFormData] = useState({});
  const [templates, setTemplates] = useState([]);
  const [sender, setSender] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/v1/emailTemplate");
        setTemplates(response.data.data.templates);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);
  
  useEffect(() => {
    const fetchSender = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/v1/sender");
        setSender(response.data.data.results); // Corrected path to `results`
        console.log("Fetched senders:", response.data.data.results);
      } catch (error) {
        console.error("Error fetching senders:", error);
      }
    };
  
    fetchSender();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      if (value.trim() === "") {
        const newData = { ...prev };
        delete newData[name];
        return newData;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let parsedClients = [];
  
      // ✅ Safely parse `clients` field
      if (formData.clients) {
        try {
          parsedClients = JSON.parse(formData.clients);
          if (!Array.isArray(parsedClients)) {
            throw new Error("Clients must be a valid JSON array.");
          }
        } catch (error) {
          alert(
            `Invalid clients format. Please provide a valid JSON array. Example:
            [
              {
                "to": "sales@sahoowebsolutions.com",
                "url": "sahoowebsolutions.com"
              },
              {
                "to": "sales@sahoowebsolutions.com",
                "url": "sahoowebsolutions.com"
              }
            ]`);
          return;
        }
      }
  
      const formattedData = {
        ...formData,
        clients: parsedClients,
      };
  
      const response = await axios.post(`http://localhost:5004/api/v1/email`, formattedData);
      console.log("Network Payload:", formattedData);
      console.log("Response:", response.data);
      alert("Form submitted successfully!");
  
      // ✅ Clear form fields after successful submission
      // setFormData({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };
  

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <form onSubmit={handleSubmit}>
        {/* MUI TextArea */}
        <TextField
          required
          label="clients"
          name="clients"
          value={formData.clients || ""}
          onChange={handleChange}
          multiline
          rows={10}
          fullWidth
          variant="outlined"
          placeholder={` [
                          {
                            "to": "sales@sahoowebsolutions.com",
                            "url": "sahoowebsolutions.com"
                          },
                          {
                            "to": "sales@sahoowebsolutions.com",
                            "url": "sahoowebsolutions.com"
                          }
                      ]`}
          margin="normal"
        />

        {/* MUI Dropdown 1 */}
        <TextField
        required
          label="sender"
          name="sender"
          value={formData.sender || ""}
          onChange={handleChange}
          select
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="">Select an option</MenuItem>
           {sender.map((item) => (
            <MenuItem key={item.id} value={item.from_email}>
              {item.from_email}
            </MenuItem>
          ))}
        </TextField>
        


        {/* MUI Dropdown 2 */}
        <TextField
          required
          label="templateId"
          name="templateId"
          value={formData.templateId || ""}
          onChange={handleChange}
          select
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="">Select an option</MenuItem>
          {templates.map((template) => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </TextField>

        {/* MUI Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default App;
