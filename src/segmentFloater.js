import React, { useEffect, useState } from "react";
import "./segmentFloater.css";
import DropDown from "./dropdown";
import options from "./options";
import axios from "axios";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function SegmentFloater({ handleClose }) {
  const [segmentName, setSegmentName] = useState("");
  const [addNew, setAddNew] = useState(null);
  const [schema, setSchema] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(options);

  useEffect(() => {
    setAddNew(null);
  }, [schema]);

  const handleAddItemToSchema = () => {
    if (addNew !== null) {
      const matchingOption = availableOptions.find(
        (option) => option.value === addNew
      );
      if (matchingOption) {
        setSchema((prevSchema) => [
          ...prevSchema,
          { label: matchingOption.label, value: matchingOption.value },
        ]);
        setAvailableOptions(
          availableOptions.filter((option) => option.value !== addNew)
        );
      }
    } else {
      alert("Please select an item in the dropdown");
    }
  };

  const handleDropDownChange = (index, selectedValue) => {
    const matchingOption = availableOptions.find(
      (option) => option.value === selectedValue
    );
    if (matchingOption) {
      const updatedSchema = schema.map((item, i) => {
        if (i === index) {
          return {
            label: matchingOption.label,
            value: matchingOption.value,
          };
        }
        return item;
      });
      setSchema(updatedSchema);
      setAvailableOptions([...availableOptions, schema[index]]);
    }
  };

  const handleRemoveItemFromSchema = (index) => {
    setSchema((prevSchema) => {
      const updatedSchema = prevSchema.filter((item, i) => i !== index);
      setAvailableOptions([...availableOptions, prevSchema[index]]);
      return updatedSchema;
    });
  };

  const handleSaveSchema = async () => {
    if (segmentName.trim() === "") {
      alert("Please provide a segment name.");
      return;
    }
    const formattedSchema = {
      segment_name: segmentName,
      schema: schema.map((item) => ({
        [item.value]: item.label,
      })),
    };

    try {
      // Send data to the server
      const response = await axios.post(
        "https://webhook.site/d5d1ca93-f520-4f47-a7b2-ddec7c109040",
        formattedSchema
      );
      console.log("Response from server:", response.data);
      alert("Segment saved successfully!");
    } catch (error) {
      console.error("Error saving segment:", error);
      alert("Error saving segment. Please try again later.");
    }
  };

  return (
    <div className="App">
      <div className="savingSegment">
        <ArrowBackIosIcon fontSize="small" />
        Saving Segment
      </div>
      <div className="segmentBtn">
        <div className="segmentContainer">
          <div style={{ marginBottom: "10px" }}>
            <div style={{ marginBottom: "10px" }}>
              Enter the name of the segment
            </div>
            <input
              className="segmentInputBox"
              placeholder="Name of the segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            To Save your segment, you need to add the schemas to build the query
          </div>
          {schema.length > 0 && (
            <div className="SchemaContainer">
              {schema.map((item, index) => (
                <div key={index} className="SchemaItem">
                  <DropDown
                    value={item.value}
                    options={options}
                    callback={(selectedValue) =>
                      handleDropDownChange(index, selectedValue)
                    }
                  />
                  <button
                    onClick={() => handleRemoveItemFromSchema(index)}
                    className="schema-btn"
                  >
                    <span></span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {availableOptions.length > 0 ? (
            <DropDown
              value={addNew}
              options={availableOptions}
              callback={(selectedValue) => setAddNew(selectedValue)}
            />
          ) : (
            <p>No options remaining</p>
          )}

          <p className="addItemLink" onClick={handleAddItemToSchema}>
            + Add new schema
          </p>
        </div>
      </div>
      <div className="bgColorContainer">
        <div className="saveSegmentButtonContainer">
          <button className="saveSchemaButton" onClick={handleSaveSchema}>
            Save the segment
          </button>
          &nbsp;
          <button className="cancelButton" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SegmentFloater;
