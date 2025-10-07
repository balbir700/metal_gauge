def naive_string_matcher(text: str, pattern: str):
    n = len(text)
    m = len(pattern)

    found_indices = []

    if n==0 or m==0 or m>n:
        return found_indices
    

    for i in range(n - m + 1):
        is_match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                is_match = False
                break
        if is_match == True:
            found_indices.append(i)  # found_indices+=i
        
    return found_indices
# Example usage
text = "hello world i am here to help you with programming"
pattern = "o"
result = naive_string_matcher(text, pattern)
if result:      
    print(f"Pattern found at indices: {result}")        

else:
    print("Pattern not found")  